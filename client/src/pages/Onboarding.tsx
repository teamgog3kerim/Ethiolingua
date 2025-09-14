import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const { toast } = useToast();

  const onboardingMutation = useMutation({
    mutationFn: async (nativeLanguage: string) => {
      await apiRequest("POST", "/api/onboarding", { nativeLanguage });
    },
    onSuccess: () => {
      window.location.reload(); // Refresh to get updated user data
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleContinue = () => {
    if (selectedLanguage) {
      onboardingMutation.mutate(selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Progress indicator */}
        <div className="flex items-center mb-8">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/3 transition-all duration-500"></div>
          </div>
          <span className="ml-3 text-sm text-muted-foreground">1/3</span>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="title-select-language">
            Select Your Native Language
          </h2>
          <p className="text-muted-foreground">
            This helps us personalize your learning experience
          </p>
        </div>
        
        <div className="space-y-4">
          <Card 
            className={`border-2 rounded-2xl p-4 hover:border-primary transition-colors cursor-pointer ${
              selectedLanguage === 'english' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => setSelectedLanguage('english')}
            data-testid="option-english"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-full flex items-center justify-center shadow-md mr-4">
                <span className="text-2xl">🇺🇸</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">English</h3>
                <p className="text-sm text-muted-foreground">I speak English natively</p>
              </div>
              <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                selectedLanguage === 'english' ? 'border-primary' : 'border-border'
              }`}>
                {selectedLanguage === 'english' && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
          </Card>
          
          <Card 
            className={`border-2 rounded-2xl p-4 hover:border-primary transition-colors cursor-pointer ${
              selectedLanguage === 'arabic' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => setSelectedLanguage('arabic')}
            data-testid="option-arabic"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-white to-red-500 rounded-full flex items-center justify-center shadow-md mr-4">
                <span className="text-2xl">🇸🇦</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">العربية</h3>
                <p className="text-sm text-muted-foreground">أتحدث العربية كلغة أم</p>
              </div>
              <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                selectedLanguage === 'arabic' ? 'border-primary' : 'border-border'
              }`}>
                {selectedLanguage === 'arabic' && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-8">
          <Button 
            onClick={handleContinue}
            disabled={!selectedLanguage || onboardingMutation.isPending}
            className="w-full font-semibold py-4 px-6 rounded-2xl"
            data-testid="button-continue"
          >
            {onboardingMutation.isPending ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
