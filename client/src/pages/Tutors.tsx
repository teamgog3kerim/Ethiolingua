import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Tutor {
  id: string;
  name: string;
  profileImageUrl?: string;
  bio?: string;
  specialties: string[];
  languages: string[];
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  isActive: boolean;
}

export default function Tutors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const { data: tutors, isLoading, error } = useQuery<Tutor[]>({
    queryKey: ["/api/tutors"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load tutors</h2>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredTutors = tutors?.filter(tutor => {
    const matchesSearch = !searchTerm || 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = filterSpecialty === "all" || 
      tutor.specialties.includes(filterSpecialty);
    
    return matchesSearch && matchesSpecialty;
  }) || [];

  const sortedTutors = [...filteredTutors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.hourlyRate - b.hourlyRate;
      case "price-high":
        return b.hourlyRate - a.hourlyRate;
      case "experience":
        return b.totalSessions - a.totalSessions;
      default:
        return b.rating - a.rating;
    }
  });

  const formatRating = (rating: number) => {
    return (rating / 100).toFixed(1);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Live Tutors</h1>
              <p className="text-muted-foreground">Practice with native Amharic speakers</p>
            </div>
            <Link href="/sessions/my">
              <Button variant="outline" size="sm">
                <i className="fas fa-calendar-alt mr-2"></i>
                My Sessions
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                placeholder="Search by name or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-tutors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Specialty</label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger data-testid="select-specialty">
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All specialties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="pronunciation">Pronunciation</SelectItem>
                  <SelectItem value="conversation">Conversation</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Tutors Grid */}
        {sortedTutors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-graduate text-muted-foreground text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">No tutors found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTutors.map((tutor) => (
              <Card key={tutor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Tutor Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      {tutor.profileImageUrl ? (
                        <img 
                          src={tutor.profileImageUrl} 
                          alt={tutor.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {tutor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-1">{tutor.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-star text-yellow-500 text-sm"></i>
                          <span className="text-sm font-medium ml-1">{formatRating(tutor.rating)}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          ({tutor.totalSessions} sessions)
                        </span>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(tutor.hourlyRate)}/hr
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {tutor.languages.map((language, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {tutor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  {tutor.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {tutor.bio}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/tutors/${tutor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" data-testid={`button-view-${tutor.id}`}>
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/book-session/${tutor.id}`} className="flex-1">
                      <Button className="w-full" data-testid={`button-book-${tutor.id}`}>
                        Book Session
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}