import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
      // Try multiple languages for better Amharic pronunciation detection
      // Start with English but the system will adapt based on phonetic analysis
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3; // Get multiple alternatives
      recognition.grammars = null; // Allow free-form speech
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = async (event: any) => {
        const current = event.resultIndex;
        let transcript = event.results[current][0].transcript;
        
        // Try to get the best alternative if available
        if (event.results[current].length > 1) {
          // Check all alternatives and pick the best match
          const alternatives = Array.from(event.results[current]).map((alt: any) => alt.transcript);
          transcript = alternatives[0]; // For now, use the first (most confident) alternative
        }
        
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          try {
            const score = await calculatePronunciationScore(transcript, targetText);
            onResult(score, transcript);
          } catch (error) {
            console.error("Error calculating pronunciation score:", error);
            toast({
              title: "Pronunciation Analysis Failed",
              description: "Using basic scoring. Please check your internet connection.",
              variant: "destructive",
            });
            // Provide a fallback score based on basic string similarity
            const basicScore = transcript.toLowerCase().trim() === targetText.toLowerCase().trim() ? 100 : 
                               transcript.toLowerCase().includes(targetText.toLowerCase().substring(0, 3)) ? 75 : 50;
            onResult(basicScore, transcript);
          }
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorTitle = "Recognition Error";
        let errorDescription = "Please try again.";
        
        switch(event.error) {
          case 'no-speech':
            errorTitle = "No Speech Detected";
            errorDescription = "We didn't hear anything. Please speak clearly into your microphone and try again.";
            break;
          case 'audio-capture':
            errorTitle = "Microphone Access Denied";
            errorDescription = "Please allow microphone access in your browser settings and refresh the page.";
            break;
          case 'not-allowed':
            errorTitle = "Microphone Permission Required";
            errorDescription = "Please allow microphone access to use pronunciation practice.";
            break;
          case 'network':
            errorTitle = "Network Error";
            errorDescription = "Please check your internet connection and try again.";
            break;
          case 'service-not-allowed':
            errorTitle = "Speech Service Unavailable";
            errorDescription = "Speech recognition service is not available. Please try again later.";
            break;
          default:
            errorTitle = "Recognition Error";
            errorDescription = `Error: ${event.error}. Please ensure your microphone is working and try again.`;
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
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

  const calculatePronunciationScore = async (spoken: string, target: string, retryCount = 0): Promise<number> => {
    // Improved scoring algorithm for Amharic pronunciation using server-side transliteration
    const spokenLower = spoken.toLowerCase().trim();
    const targetLower = target.toLowerCase().trim();
    
    if (spokenLower === targetLower) return 100;
    
    const maxRetries = 2;
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff, max 5s
    
    try {
      // Use server-side phonetic transliteration for better Amharic support
      const [spokenPhoneticResponse, targetPhoneticResponse] = await Promise.all([
        apiRequest('POST', '/api/phonetic-transliteration', { text: spokenLower }),
        apiRequest('POST', '/api/phonetic-transliteration', { text: targetLower })
      ]);

      const spokenPhoneticData = await spokenPhoneticResponse.json();
      const targetPhoneticData = await targetPhoneticResponse.json();
      
      const spokenPhonetic = spokenPhoneticData.phoneticText;
      const targetPhonetic = targetPhoneticData.phoneticText;
      
      // Check phonetic similarity first
      if (spokenPhonetic === targetPhonetic) return 95;
      
      // Calculate both regular and phonetic similarity
      const regularDistance = levenshteinDistance(spokenLower, targetLower);
      const phoneticDistance = levenshteinDistance(spokenPhonetic, targetPhonetic);
      
      const regularMaxLength = Math.max(spoken.length, target.length);
      const phoneticMaxLength = Math.max(spokenPhonetic.length, targetPhonetic.length);
      
      const regularSimilarity = regularMaxLength > 0 ? 1 - (regularDistance / regularMaxLength) : 0;
      const phoneticSimilarity = phoneticMaxLength > 0 ? 1 - (phoneticDistance / phoneticMaxLength) : 0;
      
      // Use the better of the two similarities, weighted toward phonetic
      const finalSimilarity = Math.max(regularSimilarity * 0.3 + phoneticSimilarity * 0.7, phoneticSimilarity);
      
      // Score from 0-100, minimum 25 for attempting
      return Math.max(25, Math.round(finalSimilarity * 100));
    } catch (error) {
      console.error(`Error in phonetic transliteration (attempt ${retryCount + 1}):`, error);
      
      // Retry on network errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (retryCount < maxRetries && (
        errorMessage.includes('fetch') || 
        errorMessage.includes('network') || 
        errorMessage.includes('timeout')
      )) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return calculatePronunciationScore(spoken, target, retryCount + 1);
      }
      
      // Final fallback to basic string similarity if all retries fail
      const distance = levenshteinDistance(spokenLower, targetLower);
      const maxLength = Math.max(spoken.length, target.length);
      const similarity = maxLength > 0 ? 1 - (distance / maxLength) : 0;
      return Math.max(25, Math.round(similarity * 100));
    }
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
      <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-2 border-red-200 dark:border-red-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
          </div>
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Speech Recognition Unavailable</h3>
          <p className="text-red-700 dark:text-red-300 text-sm mb-4">
            Your browser doesn't support speech recognition. Please try using:
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-red-600 dark:text-red-400">
            <div className="flex items-center gap-1">
              <i className="fab fa-chrome"></i>
              <span>Chrome</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fab fa-edge"></i>
              <span>Edge</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fab fa-safari"></i>
              <span>Safari</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <h3 className="text-xl font-bold text-foreground">Pronunciation Practice</h3>
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          </div>
          <div className="bg-gradient-to-r from-background to-muted/50 rounded-xl p-4 mb-4 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Practice saying:</p>
            <p className="text-2xl font-bold text-primary mb-2 tracking-wide">{targetText}</p>
            <div className="w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-30"></div>
          </div>
        </div>
        
        {transcript && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-comment text-green-600 dark:text-green-400"></i>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">What you said:</p>
            </div>
            <p className="font-semibold text-green-900 dark:text-green-100 text-lg">{transcript}</p>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-6">
          {isListening ? (
            <>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                  <i className="fas fa-microphone text-white text-3xl"></i>
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute -inset-2 w-28 h-28 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse opacity-10"></div>
              </div>
              <Button 
                onClick={stopListening}
                variant="outline"
                size="lg"
                className="bg-background hover:bg-muted border-2 border-red-200 hover:border-red-300 transition-all duration-200"
                data-testid="button-stop-recording"
              >
                <i className="fas fa-stop mr-2 text-red-500"></i>
                Stop Recording
              </Button>
              <div className="text-center">
                <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-1">🎤 Listening...</p>
                <p className="text-sm text-muted-foreground">Speak clearly into your microphone</p>
              </div>
            </>
          ) : (
            <>
              <div className="relative group cursor-pointer" onClick={startListening}>
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <i className="fas fa-microphone text-white text-3xl"></i>
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
              <Button 
                onClick={startListening}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid="button-start-recording"
              >
                <i className="fas fa-play mr-2"></i>
                Start Recording
              </Button>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">🎯 Ready to practice</p>
                <p className="text-xs text-muted-foreground">Click the button above to begin</p>
              </div>
            </>
          )}
        </div>
        
        {/* Tips section */}
        <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Speak slowly and clearly. The system will score your pronunciation accuracy.
          </p>
        </div>
      </div>
    </Card>
  );
}