import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "1");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", lessonId],
  });

  const progressMutation = useMutation({
    mutationFn: async (data: { completed: boolean; score: number; timeSpent: number }) => {
      await apiRequest("POST", "/api/progress", {
        lessonId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lesson || !lesson.quizQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Quiz not available</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const questions = lesson.quizQuestions;
  const question = questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      // Calculate score
      const correctAnswers = newAnswers.filter((answer, index) => answer === questions[index].answer).length;
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      setShowResult(true);

      // Save progress
      progressMutation.mutate({
        completed: true,
        score: finalScore,
        timeSpent: 180, // 3 minutes default
      });
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 text-center">
          <div className="mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              score >= 80 ? 'bg-primary' : score >= 60 ? 'bg-secondary' : 'bg-destructive'
            }`}>
              <i className={`text-2xl text-white ${
                score >= 80 ? 'fas fa-trophy' : score >= 60 ? 'fas fa-thumbs-up' : 'fas fa-redo'
              }`}></i>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-quiz-score">
              {score}% Score
            </h2>
            <p className="text-muted-foreground">
              {score >= 80 ? "Excellent work!" : score >= 60 ? "Good job!" : "Keep practicing!"}
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full" data-testid="button-continue-learning">
                Continue Learning
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
              data-testid="button-retake-quiz"
            >
              Retake Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Quiz Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href={`/lesson/${lessonId}`}>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-muted rounded-xl">
                <i className="fas fa-arrow-left text-muted-foreground"></i>
              </Button>
            </Link>
            
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span data-testid="text-question-number">Question {currentQuestion + 1} of {questions.length}</span>
                <span>Quiz Time!</span>
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary transition-all duration-500" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <i className="fas fa-clock"></i>
              <span>2:30</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Question */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="text-question">
            {question.question}
          </h1>
          
          {question.type === "multipleChoice" && lesson.content && (
            <Card className="border border-border rounded-3xl p-12 mb-8">
              <div className="amharic-text text-9xl text-primary font-bold" data-testid="text-quiz-character">
                {lesson.content.amharic[0]}
              </div>
            </Card>
          )}
        </div>
        
        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option: string, index: number) => (
            <Card
              key={index}
              className={`border-2 rounded-2xl p-6 text-left hover:border-primary transition-colors cursor-pointer ${
                selectedAnswer === option ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handleAnswerSelect(option)}
              data-testid={`option-${index}`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  selectedAnswer === option ? 'bg-primary' : 'bg-primary/10'
                }`}>
                  <span className={`font-bold ${
                    selectedAnswer === option ? 'text-primary-foreground' : 'text-primary'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-medium text-foreground">{option}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Help Options */}
        <Card className="bg-muted/50 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <i className="fas fa-lightbulb"></i>
                Hint
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <i className="fas fa-volume-up"></i>
                Play Audio
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((heart) => (
                <i 
                  key={heart} 
                  className={`fas fa-heart ${
                    heart <= 3 ? 'text-secondary' : 'text-muted-foreground opacity-30'
                  }`}
                ></i>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" className="px-6 py-3 rounded-2xl font-medium">
            Skip
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="px-8 py-3 rounded-2xl font-medium"
            data-testid="button-check-answer"
          >
            {currentQuestion + 1 < questions.length ? "Next Question" : "Finish Quiz"}
          </Button>
        </div>
      </main>
    </div>
  );
}
