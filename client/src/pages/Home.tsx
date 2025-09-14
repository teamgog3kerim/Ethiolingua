import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LessonCard } from "@/components/LessonCard";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: lessons, isLoading: lessonsLoading, error } = useQuery({
    queryKey: ["/api/lessons"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const freeLessons = lessons?.slice(0, 5) || [];
  const lockedLessons = lessons?.slice(5, 8) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <div className="amharic-text text-xl text-primary-foreground font-bold">አ</div>
            </div>
            <div>
              <h1 className="font-bold text-foreground" data-testid="text-app-name">
                Learn Amharic
              </h1>
              <p className="text-xs text-muted-foreground" data-testid="text-user-language">
                {user?.nativeLanguage === 'arabic' ? 'Arabic Speaker' : 'English Speaker'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Streak indicator */}
            <div className="flex items-center gap-1 bg-secondary/10 px-3 py-1 rounded-full">
              <i className="fas fa-fire text-accent text-sm"></i>
              <span className="text-sm font-medium text-foreground" data-testid="text-streak">
                {stats?.currentStreak || 0}
              </span>
            </div>
            
            {/* Profile */}
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center cursor-pointer">
              <i className="fas fa-user text-muted-foreground text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lessons Completed */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-book text-primary"></i>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-completed-lessons">
                    {stats?.completedLessons || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                </div>
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${Math.min(((stats?.completedLessons || 0) / 20) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.completedLessons || 0}/20 Beginner Level
              </p>
            </Card>
            
            {/* Study Time */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-accent"></i>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-study-time">
                    {((stats?.totalTimeMinutes || 0) / 60).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Hours</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">This week</p>
            </Card>
            
            {/* Accuracy */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-target text-secondary"></i>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-accuracy">
                    {Math.round(stats?.averageScore || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">% Accuracy</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </Card>
          </div>
        </div>

        {/* Current Level */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Beginner Level</h2>
            <Link href="/subscription">
              <Button variant="ghost" className="text-primary font-medium text-sm hover:underline">
                <i className="fas fa-crown text-secondary mr-1"></i>
                Upgrade to Pro
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeLessons.map((lesson: any) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
            
            {lockedLessons.map((lesson: any, index: number) => (
              <Card key={lesson.id} className="bg-muted/50 border border-border rounded-2xl p-4 transition-all duration-300 cursor-pointer opacity-60">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">Pro only</p>
                  </div>
                  <div className="w-8 h-8 border-2 border-muted-foreground/30 rounded-full flex items-center justify-center">
                    <i className="fas fa-lock text-muted-foreground text-sm"></i>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Pro only</span>
                  <Link href="/subscription">
                    <Button size="sm" className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-medium text-xs">
                      Unlock
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Practice</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/quiz/1">
              <Card className="p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-question text-primary"></i>
                </div>
                <h3 className="font-semibold text-foreground text-sm">Quiz</h3>
                <p className="text-xs text-muted-foreground">Test knowledge</p>
              </Card>
            </Link>
            
            <Link href="/tutor">
              <Card className="p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-robot text-accent"></i>
                </div>
                <h3 className="font-semibold text-foreground text-sm">AI Tutor</h3>
                <p className="text-xs text-muted-foreground">Practice chat</p>
              </Card>
            </Link>
            
            <Link href="/tutors">
              <Card className="p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-video text-secondary"></i>
                </div>
                <h3 className="font-semibold text-foreground text-sm">Live Tutors</h3>
                <p className="text-xs text-muted-foreground">Practice with natives</p>
              </Card>
            </Link>
            
            <Card className="p-4 text-center hover:shadow-md transition-all duration-300 opacity-60">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-video text-primary"></i>
              </div>
              <h3 className="font-semibold text-foreground text-sm">Live Tutor</h3>
              <p className="text-xs text-muted-foreground">Pro only</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
