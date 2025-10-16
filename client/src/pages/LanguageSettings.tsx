import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Languages, Globe } from "lucide-react";

export default function LanguageSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, setLanguage } = useLanguage();
  const [selectedInterface, setSelectedInterface] = useState(user?.interfaceLanguage || "english");
  const [selectedNative, setSelectedNative] = useState(user?.nativeLanguage || "english");

  const updateLanguageSettingsMutation = useMutation({
    mutationFn: async (updates: any) => {
      await apiRequest("POST", "/api/user/settings", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Language settings updated",
        description: "Your language preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update language settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    // Update context immediately for better UX
    setLanguage(selectedInterface as any);
    
    updateLanguageSettingsMutation.mutate({
      interfaceLanguage: selectedInterface,
      nativeLanguage: selectedNative,
    });
  };

  const interfaceLanguages = [
    {
      value: "english",
      label: "English",
      nativeLabel: "English",
      description: "Use English for menus, buttons, and interface elements",
    },
    {
      value: "arabic",
      label: "Arabic",
      nativeLabel: "العربية",
      description: "استخدم العربية لعناصر الواجهة والقوائم والأزرار",
    },
  ];

  const nativeLanguages = [
    {
      value: "english",
      label: "English",
      nativeLabel: "English",
      description: "I'm a native English speaker learning Amharic",
    },
    {
      value: "arabic",
      label: "Arabic",
      nativeLabel: "العربية",
      description: "أنا متحدث أصلي للعربية أتعلم الأمهرية",
    },
  ];

  const hasChanges = 
    selectedInterface !== (user?.interfaceLanguage || "english") ||
    selectedNative !== (user?.nativeLanguage || "english");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/settings">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('languageSettings.title')}</h1>
            <p className="text-muted-foreground">{t('languageSettings.description')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Interface Language */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('languageSettings.interfaceLanguage')}</h3>
                <p className="text-sm text-muted-foreground">{t('languageSettings.interfaceDescription')}</p>
              </div>
            </div>

            <RadioGroup 
              value={selectedInterface} 
              onValueChange={setSelectedInterface}
              className="space-y-4"
            >
              {interfaceLanguages.map((lang) => (
                <div key={lang.value} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={lang.value} 
                      id={`interface-${lang.value}`}
                      data-testid={`radio-interface-${lang.value}`}
                    />
                    <Label 
                      htmlFor={`interface-${lang.value}`} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{lang.label}</span>
                          <span className="text-lg ml-2">{lang.nativeLabel}</span>
                        </div>
                        {selectedInterface === lang.value && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lang.description}
                      </p>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Native Language */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('languageSettings.nativeLanguage')}</h3>
                <p className="text-sm text-muted-foreground">{t('languageSettings.nativeDescription')}</p>
              </div>
            </div>

            <RadioGroup 
              value={selectedNative} 
              onValueChange={setSelectedNative}
              className="space-y-4"
            >
              {nativeLanguages.map((lang) => (
                <div key={lang.value} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={lang.value} 
                      id={`native-${lang.value}`}
                      data-testid={`radio-native-${lang.value}`}
                    />
                    <Label 
                      htmlFor={`native-${lang.value}`} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{lang.label}</span>
                          <span className="text-lg ml-2">{lang.nativeLabel}</span>
                        </div>
                        {selectedNative === lang.value && (
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lang.description}
                      </p>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Learning Preferences */}
          <Card className="p-6 bg-muted/50">
            <h4 className="font-semibold mb-3">{t('languageSettings.learningOptimization')}</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Lessons will be optimized for {selectedNative === "arabic" ? "Arabic" : "English"} speakers</p>
              <p>• Translation hints will appear in your native language</p>
              <p>• Cultural context will be provided from your perspective</p>
              <p>• Grammar explanations will reference {selectedNative === "arabic" ? "Arabic" : "English"} patterns</p>
            </div>
          </Card>

          {/* Save Button */}
          {hasChanges && (
            <div className="sticky bottom-6 bg-background/80 backdrop-blur-sm rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('languageSettings.unsavedChanges')}</p>
                  <p className="text-sm text-muted-foreground">{t('languageSettings.savePreferences')}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedInterface(user?.interfaceLanguage || "english");
                      setSelectedNative(user?.nativeLanguage || "english");
                    }}
                  >
                    {t('languageSettings.reset')}
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={updateLanguageSettingsMutation.isPending}
                    data-testid="button-save-language-settings"
                  >
                    {updateLanguageSettingsMutation.isPending ? t('languageSettings.saving') : t('languageSettings.saveChanges')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}