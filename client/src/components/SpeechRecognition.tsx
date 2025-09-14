import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SpeechRecognitionProps {
  targetText: string;
  onResult: (score: number, transcript: string) => void;
  isActive?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function SpeechRecognition({ targetText, onResult, isActive = true }: SpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'am-ET'; // Amharic (Ethiopia)
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          const score = calculatePronunciationScore(transcript, targetText);
          onResult(score, transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Recognition Error",
          description: "Please try again. Make sure your microphone is working.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [targetText, onResult, toast]);

  const calculatePronunciationScore = (spoken: string, target: string): number => {
    // Simple scoring algorithm based on string similarity
    const spokenLower = spoken.toLowerCase().trim();
    const targetLower = target.toLowerCase().trim();
    
    if (spokenLower === targetLower) return 100;
    
    // Calculate Levenshtein distance for similarity
    const distance = levenshteinDistance(spokenLower, targetLower);
    const maxLength = Math.max(spoken.length, target.length);
    const similarity = 1 - (distance / maxLength);
    
    // Score from 0-100, minimum 20 for attempting
    return Math.max(20, Math.round(similarity * 100));
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isActive) {
    return null;
  }

  if (!isSupported) {
    return (
      <Card className="p-4 bg-muted/50">
        <p className="text-center text-muted-foreground text-sm">
          Speech recognition is not supported in your browser. Please try Chrome or Edge.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Pronunciation Practice</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Say the Amharic phrase: <span className="font-semibold text-foreground">{targetText}</span>
        </p>
        
        {transcript && (
          <div className="bg-background rounded-lg p-3 mb-4">
            <p className="text-sm text-muted-foreground">You said:</p>
            <p className="font-medium text-foreground">{transcript}</p>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4">
          {isListening ? (
            <>
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center animate-pulse">
                <i className="fas fa-microphone text-secondary-foreground text-2xl"></i>
              </div>
              <Button 
                onClick={stopListening}
                variant="outline"
                data-testid="button-stop-recording"
              >
                Stop Recording
              </Button>
              <p className="text-sm text-muted-foreground">Listening...</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer">
                <i className="fas fa-microphone text-primary-foreground text-2xl"></i>
              </div>
              <Button 
                onClick={startListening}
                className="px-6 py-2"
                data-testid="button-start-recording"
              >
                Start Recording
              </Button>
              <p className="text-xs text-muted-foreground">
                Click to practice pronunciation
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}