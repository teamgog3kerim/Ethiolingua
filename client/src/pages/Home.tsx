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
      <header className="bg-gradient-to-r from-card via-primary/5 to-secondary/5 shadow-lg border-b border-primary/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="amharic-text text-xl text-white font-bold">አ</div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" data-testid="text-app-name">
                Learn Amharic
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground flex items-center gap-1" data-testid="text-user-language">
                <i className="fas fa-globe text-primary text-xs"></i>
                {user?.nativeLanguage === 'arabic' ? 'Arabic Speaker' : 'English Speaker'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak indicator */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-accent/20 to-secondary/20 px-3 py-2 rounded-full border border-accent/30 shadow-sm hover:shadow-md transition-all duration-200">
              <i className="fas fa-fire text-accent text-sm animate-pulse"></i>
              <span className="text-sm font-bold text-foreground" data-testid="text-streak">
                {stats?.currentStreak || 0}
              </span>
            </div>
            
            {/* Profile */}
            <div className="w-10 h-10 bg-gradient-to-br from-muted to-muted/80 rounded-full flex items-center justify-center cursor-pointer hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 shadow-sm hover:shadow-md">
              <i className="fas fa-user text-muted-foreground hover:text-primary text-sm transition-colors duration-200"></i>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Progress Overview */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Your Progress</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Lessons Completed */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-book text-white text-lg"></i>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" data-testid="text-completed-lessons">
                    {stats?.completedLessons || 0}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Lessons</p>
                </div>
              </div>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden mb-3 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out" 
                  style={{ width: `${Math.min(((stats?.completedLessons || 0) / 20) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <i className="fas fa-target text-primary text-xs"></i>
                {stats?.completedLessons || 0}/20 Beginner Level
              </p>
            </Card>
            
            {/* Study Time */}
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-clock text-white text-lg"></i>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent to-orange-500 bg-clip-text text-transparent" data-testid="text-study-time">
                    {((stats?.totalTimeMinutes || 0) / 60).toFixed(1)}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <p className="text-xs font-medium text-muted-foreground">This week</p>
              </div>
            </Card>
            
            {/* Accuracy */}
            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-target text-white text-lg"></i>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-secondary to-purple-500 bg-clip-text text-transparent" data-testid="text-accuracy">
                    {Math.round(stats?.averageScore || 0)}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">% Accuracy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                <p className="text-xs font-medium text-muted-foreground">Overall performance</p>
              </div>
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
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-accent to-secondary rounded-full"></div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Quick Practice</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <Link href="/quiz/1">
              <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i className="fas fa-question text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-foreground text-base mb-2">Quiz Challenge</h3>
                <p className="text-sm text-muted-foreground">Test your knowledge</p>
              </Card>
            </Link>
            
            <Link href="/tutor">
              <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i className="fas fa-robot text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-foreground text-base mb-2">AI Tutor</h3>
                <p className="text-sm text-muted-foreground">Practice conversations</p>
              </Card>
            </Link>
            
            <Link href="/tutors">
              <Card className="p-6 text-center bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i className="fas fa-video text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-foreground text-base mb-2">Live Tutors</h3>
                <p className="text-sm text-muted-foreground">Practice with natives</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
