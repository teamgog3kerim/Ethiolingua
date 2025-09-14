import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "1");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", lessonId],
  });

  const progressMutation = useMutation({
    mutationFn: async (data: { completed: boolean; timeSpent: number }) => {
      await apiRequest("POST", "/api/progress", {
        lessonId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Progress saved!",
        description: "Your learning progress has been updated.",
      });
    },
  });

  const handleComplete = () => {
    progressMutation.mutate({
      completed: true,
      timeSpent: 300, // 5 minutes default
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Lesson not found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const amharicChar = lesson.content?.amharic?.[0] || "አ";
  const englishChar = lesson.content?.english?.[0] || "A";
  const arabicChar = lesson.content?.arabic?.[0] || "أ";

  return (
    <div className="min-h-screen bg-background">
      {/* Lesson Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-muted rounded-xl">
                <i className="fas fa-arrow-left text-muted-foreground"></i>
              </Button>
            </Link>
            
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span data-testid="text-lesson-number">Lesson {lesson.id} of 20</span>
                <span data-testid="text-lesson-category">{lesson.category}</span>
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${(lesson.id / 20) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <i className="fas fa-heart text-secondary"></i>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Lesson Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2" data-testid="title-lesson">
            {lesson.title}
          </h1>
          <p className="text-muted-foreground">Practice pronunciation and recognition</p>
        </div>
        
        {/* Character Display */}
        <Card className="border border-border rounded-3xl p-8 mb-8 text-center">
          <div className="mb-6">
            <div className="amharic-text text-8xl text-primary font-bold mb-4" data-testid="text-amharic-character">
              {amharicChar}
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <Card className="bg-muted rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">English</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-english-character">
                  {englishChar}
                </p>
              </Card>
              <Card className="bg-muted rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Arabic</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-arabic-character">
                  {arabicChar}
                </p>
              </Card>
            </div>
          </div>
          
          {/* Audio Controls */}
          <AudioPlayer
            audioUrl={lesson.audioUrl}
            slowAudioUrl={lesson.slowAudioUrl}
            label={amharicChar}
          />
        </Card>
        
        {/* Practice Section */}
        <Card className="bg-accent/5 border border-accent/20 rounded-3xl p-6 mb-8">
          <h3 className="font-bold text-foreground mb-4 text-center">Practice Pronunciation</h3>
          <div className="text-center">
            <Link href={`/pronunciation/${lesson.id}`}>
              <Button 
                size="lg"
                className="w-20 h-20 bg-accent rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors shadow-lg mb-4"
                data-testid="button-practice-pronunciation"
              >
                <i className="fas fa-microphone text-accent-foreground text-2xl"></i>
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">Practice your Amharic pronunciation</p>
            <p className="text-xs text-accent font-medium mt-2">AI-powered speech recognition</p>
          </div>
        </Card>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="secondary"
            disabled={lesson.id <= 1}
            className="px-6 py-3 rounded-2xl font-medium"
            data-testid="button-previous"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
          </div>
          
          {lesson.completed ? (
            <Link href={`/quiz/${lesson.id}`}>
              <Button className="px-6 py-3 rounded-2xl font-medium" data-testid="button-continue">
                Take Quiz
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={progressMutation.isPending}
              className="px-6 py-3 rounded-2xl font-medium"
              data-testid="button-complete"
            >
              {progressMutation.isPending ? "Saving..." : "Complete Lesson"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
