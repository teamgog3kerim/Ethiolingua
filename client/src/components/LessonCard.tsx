import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, Clock, Star, Lock, CheckCircle2 } from "lucide-react";

import type { Lesson } from "../../../shared/schema";

interface LessonCardProps {
  lesson: Lesson & {
    completed: boolean;
    canAccess: boolean;
  };
}

export function LessonCard({ lesson }: LessonCardProps) {
  const content = lesson.content as any;
  const amharicChar = content?.amharic?.[0] || "አ";
  const englishChar = content?.english?.[0] || "A";
  const arabicChar = content?.arabic?.[0] || "أ";
  
  // Determine lesson level based on order index
  const lessonLevel = lesson.orderIndex ? 
    lesson.orderIndex <= 5 ? 'Beginner' :
    lesson.orderIndex <= 10 ? 'Elementary' : 'Intermediate' : 'Beginner';

  if (!lesson.canAccess) {
    return (
      <Card 
        className="bg-gradient-to-br from-muted/30 to-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-2xl p-6 transition-all duration-300 opacity-70 relative overflow-hidden"
        data-testid={`card-lesson-locked-${lesson.id}`}
        role="article"
        aria-label={`Locked lesson: ${lesson.title}`}
      >
        {/* Cultural accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />
        
        {/* Hero Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs px-2 py-1 bg-muted border-muted-foreground/30">
                {lessonLevel}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1 bg-secondary/10 text-secondary border-secondary/30">
                PRO
              </Badge>
            </div>
            <h3 className="font-bold text-foreground text-lg mb-1">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" aria-hidden="true" />
              Unlock with subscription
            </p>
          </div>
          <div className="w-12 h-12 border-2 border-muted-foreground/20 rounded-xl flex items-center justify-center bg-muted/30">
            <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
        
        {/* Language Preview (Blurred) */}
        <div className="mb-4 p-3 bg-muted/20 rounded-xl border border-muted-foreground/10">
          <div className="flex items-center justify-center gap-4 opacity-40 blur-sm">
            <div className="text-center">
              <div className="amharic-text text-3xl font-bold text-primary mb-1">{amharicChar}</div>
              <p className="text-xs text-muted-foreground">Amharic</p>
            </div>
            <div className="text-muted-foreground">↔</div>
            <div className="text-center">
              <div className="text-xl font-semibold text-foreground mb-1">{englishChar}</div>
              <p className="text-xs text-muted-foreground">English</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/lesson/${lesson.id}`}>
      <Card 
        className="lesson-card bg-card border border-border/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 group relative overflow-hidden"
        data-testid={`card-lesson-${lesson.id}`}
        role="article"
        aria-label={`Lesson ${lesson.id}: ${lesson.title}. ${lesson.completed ? 'Completed' : 'Available to start'}`}
      >
        {/* Cultural accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        {/* Progress indicator */}
        {lesson.completed && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
        )}
        
        {/* Hero Section */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/30">
                {lessonLevel}
              </Badge>
              {!lesson.isPremium && (
                <Badge className="text-xs px-2 py-1 bg-gradient-to-r from-secondary to-accent text-white border-0 shadow-sm">
                  FREE
                </Badge>
              )}
              {lesson.audioUrl && (
                <Badge variant="outline" className="text-xs px-2 py-1 bg-accent/10 text-accent border-accent/30 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" aria-hidden="true" />
                  Audio
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors duration-200">
              {lesson.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>15 min lesson</span>
            </p>
          </div>
        </div>
        
        {/* Language Comparison Section */}
        <div className="mb-5 p-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl border border-primary/10 group-hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            {/* Amharic */}
            <div className="text-center flex-1">
              <div className="amharic-text text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {amharicChar}
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amharic</p>
            </div>
            
            {/* Separator */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-px bg-gradient-to-r from-primary to-secondary" />
              <div className="text-xs text-muted-foreground font-medium">means</div>
              <div className="w-6 h-px bg-gradient-to-r from-secondary to-accent" />
            </div>
            
            {/* English */}
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform duration-300">
                {englishChar}
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">English</p>
            </div>
            
            {/* Arabic (RTL support) */}
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform duration-300" dir="rtl">
                {arabicChar}
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Arabic</p>
            </div>
          </div>
        </div>
        
        {/* Action Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lesson.completed ? (
              <div className="flex items-center gap-1 text-secondary">
                <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                <span className="text-sm font-semibold">Perfect!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">Not started</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground font-medium">
              {lesson.completed ? 'Review →' : 'Start →'}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
