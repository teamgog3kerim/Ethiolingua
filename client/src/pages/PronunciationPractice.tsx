import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SpeechRecognition } from "@/components/SpeechRecognition";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PronunciationResult {
  score: number;
  transcript: string;
  feedback: string;
}

export default function PronunciationPractice() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const lessonId = parseInt(id || "1");
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [results, setResults] = useState<PronunciationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const { data: lesson, isLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}`],
    enabled: !!lessonId,
  });

  const savePracticeMutation = useMutation({
    mutationFn: async (data: { scores: number[]; averageScore: number }) => {
      return await apiRequest("POST", "/api/pronunciation-practice", {
        lessonId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Practice Saved",
        description: "Your pronunciation practice has been saved to your progress.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const content = lesson.content as any;
  const amharicPhrases = content?.amharic || [];
  const englishPhrases = content?.english || [];
  const arabicPhrases = content?.arabic || [];

  if (amharicPhrases.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No content available</h2>
          <p className="text-muted-foreground mb-4">This lesson doesn't have pronunciation content yet.</p>
          <Link href={`/lesson/${lessonId}`}>
            <Button>Back to Lesson</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentAmharicPhrase = amharicPhrases[currentPhrase];
  const currentEnglishPhrase = englishPhrases[currentPhrase];
  const currentArabicPhrase = arabicPhrases[currentPhrase];

  const handlePronunciationResult = (score: number, transcript: string) => {
    const feedback = getPronunciationFeedback(score);
    const result: PronunciationResult = {
      score,
      transcript,
      feedback,
    };
    
    const newResults = [...results];
    newResults[currentPhrase] = result;
    setResults(newResults);

    toast({
      title: `Score: ${score}%`,
      description: feedback,
      variant: score >= 80 ? "default" : "destructive",
    });
  };

  const getPronunciationFeedback = (score: number): string => {
    if (score >= 90) return "Excellent pronunciation! 🎉";
    if (score >= 80) return "Great job! Very clear pronunciation. 👍";
    if (score >= 70) return "Good effort! Keep practicing. 💪";
    if (score >= 60) return "Not bad! Try speaking more clearly. 🔄";
    return "Keep practicing! Listen to the audio and try again. 📚";
  };

  const nextPhrase = () => {
    if (currentPhrase + 1 < amharicPhrases.length) {
      setCurrentPhrase(currentPhrase + 1);
    } else {
      setShowResults(true);
      savePracticeResults();
    }
  };

  const previousPhrase = () => {
    if (currentPhrase > 0) {
      setCurrentPhrase(currentPhrase - 1);
    }
  };

  const savePracticeResults = () => {
    const scores = results.map(r => r?.score || 0);
    const validScores = scores.filter(score => score > 0);
    
    // Prevent division by zero and handle case where no valid scores exist
    const averageScore = validScores.length > 0 
      ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
      : 0;
    
    // Only save if we have at least one valid score
    if (validScores.length > 0) {
      savePracticeMutation.mutate({
        scores: validScores,
        averageScore: Math.round(averageScore),
      });
    }
  };

  const restartPractice = () => {
    setCurrentPhrase(0);
    setResults([]);
    setShowResults(false);
  };

  if (showResults) {
    const validResults = results.filter(result => result && result.score > 0);
    const totalScore = validResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = validResults.length > 0 
      ? Math.round(totalScore / validResults.length)
      : 0;

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Practice Results</h1>
                <p className="text-muted-foreground">{lesson.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 text-lg">
                  Average: {averageScore}%
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-6 mb-6 text-center">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              averageScore >= 80 ? 'bg-green-100 text-green-600' : 
              averageScore >= 60 ? 'bg-yellow-100 text-yellow-600' : 
              'bg-red-100 text-red-600'
            }`}>
              <i className={`text-3xl ${
                averageScore >= 80 ? 'fas fa-trophy' : 
                averageScore >= 60 ? 'fas fa-star' : 
                'fas fa-redo'
              }`}></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {averageScore >= 80 ? 'Excellent Work!' : 
               averageScore >= 60 ? 'Good Job!' : 
               'Keep Practicing!'}
            </h2>
            <p className="text-muted-foreground mb-6">
              You scored {averageScore}% on your pronunciation practice.
            </p>
            
            <div className="grid gap-4 mb-6">
              {results.map((result, index) => (
                result && (
                  <Card key={index} className="p-4 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Phrase {index + 1}</span>
                      <Badge variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}>
                        {result.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Target: {amharicPhrases[index]}</p>
                    <p className="text-sm">You said: {result.transcript}</p>
                  </Card>
                )
              ))}
            </div>

            <div className="flex items-center gap-4 justify-center">
              <Button onClick={restartPractice} variant="outline">
                Practice Again
              </Button>
              <Link href={`/lesson/${lessonId}`}>
                <Button>Back to Lesson</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Home</Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pronunciation Practice</h1>
              <p className="text-muted-foreground">{lesson.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {currentPhrase + 1} of {amharicPhrases.length}
              </span>
              <Link href={`/lesson/${lessonId}`}>
                <Button variant="outline" size="sm">
                  <i className="fas fa-times mr-2"></i>
                  Exit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Phrase Display */}
        <Card className="p-8 mb-6 text-center">
          <div className="mb-6">
            <div className="text-4xl font-bold text-primary mb-2 amharic-text">
              {currentAmharicPhrase}
            </div>
            <div className="text-lg text-muted-foreground mb-1">
              English: {currentEnglishPhrase}
            </div>
            {currentArabicPhrase && (
              <div className="text-lg text-muted-foreground">
                Arabic: {currentArabicPhrase}
              </div>
            )}
          </div>

          {/* Audio Player */}
          {lesson.audioUrl && (
            <div className="mb-6">
              <AudioPlayer
                audioUrl={lesson.audioUrl}
                slowAudioUrl={lesson.slowAudioUrl}
                label="Listen to pronunciation"
              />
            </div>
          )}

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {amharicPhrases.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentPhrase
                    ? 'bg-primary'
                    : results[index]
                    ? results[index].score >= 80
                      ? 'bg-green-500'
                      : results[index].score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Speech Recognition */}
        <div className="mb-6">
          <SpeechRecognition
            targetText={currentAmharicPhrase}
            onResult={handlePronunciationResult}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={previousPhrase}
            disabled={currentPhrase === 0}
            variant="outline"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {results[currentPhrase] && (
              <Badge
                variant={results[currentPhrase].score >= 80 ? "default" : "secondary"}
                className="px-3 py-1"
              >
                Score: {results[currentPhrase].score}%
              </Badge>
            )}
            <Button onClick={nextPhrase} data-testid="button-next-phrase">
              {currentPhrase + 1 < amharicPhrases.length ? (
                <>
                  Next
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              ) : (
                <>
                  Finish
                  <i className="fas fa-check ml-2"></i>
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}