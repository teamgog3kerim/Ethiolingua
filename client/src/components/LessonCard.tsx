import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    content: {
      amharic: string[];
      english: string[];
      arabic: string[];
    };
    completed: boolean;
    canAccess: boolean;
    isPremium: boolean;
  };
}

export function LessonCard({ lesson }: LessonCardProps) {
  const amharicChar = lesson.content?.amharic?.[0] || "አ";
  const englishChar = lesson.content?.english?.[0] || "A";
  const arabicChar = lesson.content?.arabic?.[0] || "أ";

  if (!lesson.canAccess) {
    return (
      <Card className="bg-muted/50 border border-border rounded-2xl p-4 transition-all duration-300 opacity-60">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground">Locked</p>
          </div>
          <div className="w-8 h-8 border-2 border-muted-foreground/30 rounded-full flex items-center justify-center">
            <i className="fas fa-lock text-muted-foreground text-sm"></i>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/lesson/${lesson.id}`}>
      <Card 
        className="lesson-card bg-card border border-border rounded-2xl p-4 transition-all duration-300 cursor-pointer hover:shadow-md"
        data-testid={`card-lesson-${lesson.id}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground">
              Learn {amharicChar}
            </p>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            lesson.completed 
              ? 'bg-primary' 
              : 'border-2 border-primary'
          }`}>
            {lesson.completed ? (
              <i className="fas fa-check text-primary-foreground text-sm"></i>
            ) : (
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="amharic-text text-2xl text-primary font-bold">
            {amharicChar}
          </div>
          <div className="text-sm text-muted-foreground">→</div>
          <div className="text-lg">{englishChar}</div>
          <div className="text-sm text-muted-foreground">→</div>
          <div className="text-lg">{arabicChar}</div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {lesson.completed ? (
            <>
              <span>Completed</span>
              <span><i className="fas fa-star text-secondary mr-1"></i>Perfect!</span>
            </>
          ) : (
            <>
              <span>15 min</span>
              {!lesson.isPremium && (
                <Badge variant="secondary" className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                  FREE TRIAL
                </Badge>
              )}
            </>
          )}
        </div>
      </Card>
    </Link>
  );
}
