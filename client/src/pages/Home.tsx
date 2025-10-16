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

  const freeLessons = Array.isArray(lessons) ? lessons.slice(0, 5) : [];
  const lockedLessons = Array.isArray(lessons) ? lessons.slice(5, 8) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-card via-primary/5 to-secondary/5 shadow-lg border-b border-primary/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 pr-14 sm:pr-16">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex-shrink-0">
                <div className="amharic-text text-base sm:text-xl text-white font-bold">አ</div>
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate" data-testid="text-app-name">
                  Learn Amharic
                </h1>
                <p className="hidden sm:flex text-xs lg:text-sm text-muted-foreground items-center gap-1 truncate" data-testid="text-user-language">
                  <i className="fas fa-globe text-primary text-xs flex-shrink-0"></i>
                  <span className="truncate">{user?.nativeLanguage === 'arabic' ? 'Arabic Speaker' : 'English Speaker'}</span>
                </p>
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              {/* Streak indicator */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200">
                <i className="fas fa-fire text-orange-500 text-xs sm:text-sm animate-pulse flex-shrink-0"></i>
                <span className="text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300 min-w-[1ch]" data-testid="text-streak">
                  {(stats as any)?.currentStreak || 0}
                </span>
              </div>
              
              {/* Profile */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-muted to-muted/80 rounded-full flex items-center justify-center cursor-pointer hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0">
                <i className="fas fa-user text-muted-foreground hover:text-primary text-xs sm:text-sm transition-colors duration-200"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Progress Overview */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-primary to-secondary rounded-full flex-shrink-0"></div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Your Progress</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Lessons Completed */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <i className="fas fa-book text-white text-base sm:text-lg"></i>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" data-testid="text-completed-lessons">
                    {(stats as any)?.completedLessons || 0}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Lessons</p>
                </div>
              </div>
              <div className="flex-1 h-2 sm:h-3 bg-muted rounded-full overflow-hidden mb-2 sm:mb-3 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out" 
                  style={{ width: `${Math.min((((stats as any)?.completedLessons || 0) / 20) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <i className="fas fa-target text-primary text-xs flex-shrink-0"></i>
                <span className="truncate">{(stats as any)?.completedLessons || 0}/20 Beginner Level</span>
              </p>
            </Card>
            
            {/* Study Time */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent to-accent/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <i className="fas fa-clock text-white text-base sm:text-lg"></i>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-orange-500 bg-clip-text text-transparent" data-testid="text-study-time">
                    {(((stats as any)?.totalTimeMinutes || 0) / 60).toFixed(1)}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse flex-shrink-0"></div>
                <p className="text-xs font-medium text-muted-foreground">This week</p>
              </div>
            </Card>
            
            {/* Accuracy */}
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <i className="fas fa-target text-white text-base sm:text-lg"></i>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-secondary to-purple-500 bg-clip-text text-transparent" data-testid="text-accuracy">
                    {Math.round((stats as any)?.averageScore || 0)}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">% Accuracy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce flex-shrink-0"></div>
                <p className="text-xs font-medium text-muted-foreground">Overall performance</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Current Level */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Beginner Level</h2>
            <Link href="/subscription">
              <Button variant="ghost" className="text-primary font-medium text-sm hover:underline self-start sm:self-auto">
                <i className="fas fa-crown text-secondary mr-1 flex-shrink-0"></i>
                <span>Upgrade to Pro</span>
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {freeLessons.map((lesson: any) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
            
            {lockedLessons.map((lesson: any) => (
              <LessonCard key={lesson.id} lesson={{...lesson, canAccess: false, isPremium: true}} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-accent to-secondary rounded-full flex-shrink-0"></div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Quick Practice</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <Link href="/quiz/1">
              <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i className="fas fa-question text-white text-lg sm:text-xl"></i>
                </div>
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 sm:mb-2">Quiz Challenge</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Test your knowledge</p>
              </Card>
            </Link>
            
            <Link href="/tutor">
              <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i className="fas fa-robot text-white text-lg sm:text-xl"></i>
                </div>
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 sm:mb-2">AI Tutor</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Practice conversations</p>
              </Card>
            </Link>
            
            <Link href="/tutors">
              <Card className="p-4 sm:p-6 text-center bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 cursor-pointer group xs:col-span-2 sm:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <i className="fas fa-video text-white text-lg sm:text-xl"></i>
                </div>
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 sm:mb-2">Live Tutors</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Practice with natives</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
