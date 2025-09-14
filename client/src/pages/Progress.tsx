import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ProgressRing";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  Lock, 
  Calendar,
  Zap,
  Flame,
  GraduationCap,
  CalendarCheck,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle
} from "lucide-react";

// Define proper types for the stats data
interface UserStats {
  completedLessons: number;
  currentStreak: number;
  totalTimeMinutes: number;
  averageScore: number;
}

export default function Progress() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["/api/lessons"],
    retry: false,
  });

  if (statsLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const completedLessons = stats?.completedLessons || 0;
  const totalLessons = 20; // Beginner level
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  // Social sharing functionality
  const handleShareProgress = async () => {
    // Create personalized sharing message
    const earnedAchievements = achievements.filter(a => a.earned);
    const achievementText = earnedAchievements.length > 0 
      ? `I've earned ${earnedAchievements.length} achievements including: ${earnedAchievements.map(a => a.name).join(', ')}!` 
      : 'I\'m making great progress!';
    
    const shareText = `🎉 I'm learning Amharic with AmharicAI! \n\n` +
      `📊 My Progress: ${progressPercentage}% complete\n` +
      `📚 Completed ${completedLessons} of ${totalLessons} lessons\n` +
      `🔥 ${stats?.currentStreak || 0}-day learning streak\n` +
      `⏰ ${((stats?.totalTimeMinutes || 0) / 60).toFixed(1)} hours studied\n` +
      `${achievementText}\n\n` +
      `Join me in learning Amharic! Start your free trial at AmharicAI 🇪🇹\n\n` +
      `#AmharicLearning #LanguageLearning #Ethiopia #AI`;

    const shareUrl = window.location.origin;

    try {
      // Try Web Share API first (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: 'My Amharic Learning Progress - AmharicAI',
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully!",
          description: "Thanks for sharing your progress!",
        });
      } else {
        // Fallback: Show sharing options
        showSharingOptions(shareText, shareUrl);
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Sharing cancelled or failed:', error);
      showSharingOptions(shareText, shareUrl);
    }
  };

  const showSharingOptions = (shareText: string, shareUrl: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    // Create sharing URLs for different platforms
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    // Copy to clipboard as fallback
    const fullShareText = `${shareText}\n\n${shareUrl}`;
    navigator.clipboard.writeText(fullShareText).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Share text copied. You can now paste it on your favorite social platform.",
        action: (
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.twitter, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-twitter"
            >
              <Twitter className="h-3 w-3" />
              Twitter
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.facebook, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-facebook"
            >
              <Facebook className="h-3 w-3" />
              Facebook
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.linkedin, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-linkedin"
            >
              <Linkedin className="h-3 w-3" />
              LinkedIn
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.whatsapp, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-whatsapp"
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </Button>
          </div>
        ),
      });
    }).catch(() => {
      // Fallback: Show all sharing options instead of just opening Twitter
      toast({
        title: "Share your progress!",
        description: "Choose your preferred platform to share your Amharic learning journey:",
        action: (
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.twitter, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-twitter-fallback"
            >
              <Twitter className="h-3 w-3" />
              Twitter
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.facebook, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-facebook-fallback"
            >
              <Facebook className="h-3 w-3" />
              Facebook
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.linkedin, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-linkedin-fallback"
            >
              <Linkedin className="h-3 w-3" />
              LinkedIn
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(shareUrls.whatsapp, '_blank')}
              className="flex items-center gap-1"
              data-testid="button-share-whatsapp-fallback"
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </Button>
          </div>
        ),
      });
    });
  };

  // Mock weekly activity data
  const weekDays = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
  ];

  const achievements = [
    {
      id: 1,
      name: "5-Day Streak",
      description: "Earned today",
      icon: "fire",
      earned: (stats?.currentStreak || 0) >= 5,
      color: "secondary"
    },
    {
      id: 2,
      name: "First Lesson",
      description: "Completed",
      icon: "graduation-cap",
      earned: completedLessons >= 1,
      color: "primary"
    },
    {
      id: 3,
      name: "Perfect Week",
      description: "Complete 7 days",
      icon: "calendar-check",
      earned: false,
      color: "muted"
    },
    {
      id: 4,
      name: "Speed Learner",
      description: "Finish 10 lessons",
      icon: "bolt",
      earned: completedLessons >= 10,
      color: "accent"
    }
  ];

  const learningPath = [
    {
      name: "Alphabet Basics",
      description: "Letters አ, ለ, መ, ረ, ሰ",
      completed: completedLessons >= 5,
      current: completedLessons < 5,
      locked: false,
      progress: Math.min((completedLessons / 5) * 100, 100),
      lessons: `${Math.min(completedLessons, 5)}/5 lessons`
    },
    {
      name: "Basic Words",
      description: "Simple vocabulary & phrases",
      completed: false,
      current: completedLessons >= 5,
      locked: user?.subscriptionStatus !== 'active',
      progress: 0,
      lessons: "0/10 lessons"
    },
    {
      name: "Grammar Fundamentals", 
      description: "Sentence structure & rules",
      completed: false,
      current: false,
      locked: true,
      progress: 0,
      lessons: "15 lessons"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-muted rounded-xl">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-foreground" data-testid="title-progress">
              Your Progress
            </h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-10 h-10 bg-muted rounded-xl"
              onClick={handleShareProgress}
              data-testid="button-share-header"
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Overall Progress */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 mb-8 text-center">
          <div className="mb-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <ProgressRing 
                percentage={progressPercentage} 
                size={128}
                strokeWidth={8}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-primary" data-testid="text-progress-percentage">
                  {progressPercentage}
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Great Progress!</h2>
          <p className="text-muted-foreground mb-4" data-testid="text-lesson-progress">
            You've completed {completedLessons} out of {totalLessons} beginner lessons
          </p>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground" data-testid="text-streak-count">
                {stats?.currentStreak || 0}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground" data-testid="text-total-hours">
                {((stats?.totalTimeMinutes || 0) / 60).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground" data-testid="text-accuracy-score">
                {Math.round(stats?.averageScore || 0)}
              </div>
              <div className="text-sm text-muted-foreground">% Accuracy</div>
            </div>
          </div>
        </Card>

        {/* Learning Path */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Learning Path</h3>
          
          <div className="space-y-4">
            {learningPath.map((level, index) => (
              <Card 
                key={index} 
                className={`p-6 ${
                  level.current ? 'border-2 border-primary/20' : 
                  level.locked ? 'bg-muted/50 opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      level.completed ? 'bg-primary' :
                      level.current ? 'bg-primary/20' :
                      'bg-muted'
                    }`}>
                      {level.completed ? (
                        <Check className="h-5 w-5 text-primary-foreground" />
                      ) : level.current ? (
                        <div className="w-6 h-6 bg-primary rounded-full"></div>
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{level.name}</h4>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                      {level.locked && (
                        <div className="flex items-center gap-1 mt-1">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Upgrade to Pro to unlock</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      level.completed ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {level.completed ? '100%' : level.locked ? 'Locked' : `${Math.round(level.progress)}%`}
                    </div>
                    <div className="text-xs text-muted-foreground">{level.lessons}</div>
                  </div>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      level.completed ? 'bg-primary' : level.current ? 'bg-primary' : 'bg-muted'
                    }`}
                    style={{ width: `${level.progress}%` }}
                  ></div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">This Week's Activity</h3>
          
          <Card className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto ${
                    day.completed ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {day.completed ? (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    ) : (
                      <div className="w-3 h-3 border-2 border-muted-foreground rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent" data-testid="text-weekly-lessons">
                  {completedLessons}
                </div>
                <div className="text-sm text-muted-foreground">Lessons This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary" data-testid="text-weekly-minutes">
                  {stats?.totalTimeMinutes || 0}
                </div>
                <div className="text-sm text-muted-foreground">Minutes Studied</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Achievements</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`p-4 text-center ${!achievement.earned ? 'opacity-60' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  achievement.earned 
                    ? achievement.color === 'secondary' ? 'bg-secondary/20' :
                      achievement.color === 'primary' ? 'bg-primary/20' :
                      achievement.color === 'accent' ? 'bg-accent/20' : 'bg-muted/20'
                    : 'bg-muted'
                }`}>
                  {achievement.icon === 'fire' ? (
                    <Flame className={`h-6 w-6 ${
                      achievement.earned 
                        ? achievement.color === 'secondary' ? 'text-secondary' :
                          achievement.color === 'primary' ? 'text-primary' :
                          achievement.color === 'accent' ? 'text-accent' : 'text-muted-foreground'
                        : 'text-muted-foreground'
                    }`} />
                  ) : achievement.icon === 'graduation-cap' ? (
                    <GraduationCap className={`h-6 w-6 ${
                      achievement.earned 
                        ? achievement.color === 'secondary' ? 'text-secondary' :
                          achievement.color === 'primary' ? 'text-primary' :
                          achievement.color === 'accent' ? 'text-accent' : 'text-muted-foreground'
                        : 'text-muted-foreground'
                    }`} />
                  ) : achievement.icon === 'calendar-check' ? (
                    <CalendarCheck className={`h-6 w-6 ${
                      achievement.earned 
                        ? achievement.color === 'secondary' ? 'text-secondary' :
                          achievement.color === 'primary' ? 'text-primary' :
                          achievement.color === 'accent' ? 'text-accent' : 'text-muted-foreground'
                        : 'text-muted-foreground'
                    }`} />
                  ) : achievement.icon === 'bolt' ? (
                    <Zap className={`h-6 w-6 ${
                      achievement.earned 
                        ? achievement.color === 'secondary' ? 'text-secondary' :
                          achievement.color === 'primary' ? 'text-primary' :
                          achievement.color === 'accent' ? 'text-accent' : 'text-muted-foreground'
                        : 'text-muted-foreground'
                    }`} />
                  ) : (
                    <Calendar className={`h-6 w-6 text-muted-foreground`} />
                  )}
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  {achievement.name}
                </h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Share Progress */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-foreground mb-2">Share Your Progress</h3>
          <p className="text-muted-foreground text-sm mb-4">Let friends know about your Amharic learning journey</p>
          <Button 
            onClick={handleShareProgress}
            className="bg-primary text-primary-foreground font-medium py-3 px-6 rounded-2xl hover:bg-primary/90 transition-colors"
            data-testid="button-share-progress"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Achievement
          </Button>
        </Card>
      </main>
    </div>
  );
}
