import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Moon, 
  Sun, 
  Monitor, 
  Languages, 
  User, 
  Shield, 
  Bell, 
  ChevronRight,
  ArrowLeft 
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: any) => {
      await apiRequest("POST", "/api/user/settings", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    updateSettingsMutation.mutate({ theme: newTheme });
  };

  const handleAlwaysLoggedInToggle = (enabled: boolean) => {
    updateSettingsMutation.mutate({ alwaysLoggedIn: enabled });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
            <p className="text-muted-foreground">{t('settings.description')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('settings.appearance')}</h3>
                <p className="text-sm text-muted-foreground">{t('settings.appearanceDescription')}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-select" className="text-base font-medium">{t('settings.theme')}</Label>
                <p className="text-sm text-muted-foreground mb-3">{t('settings.themeDescription')}</p>
                <Select 
                  value={theme} 
                  onValueChange={handleThemeChange}
                  disabled={updateSettingsMutation.isPending}
                >
                  <SelectTrigger className="w-full" data-testid="select-theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default" className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      <span>{t('settings.systemDefault')}</span>
                    </SelectItem>
                    <SelectItem value="light" className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      <span>{t('settings.lightMode')}</span>
                    </SelectItem>
                    <SelectItem value="dark" className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      <span>{t('settings.darkMode')}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-6">
            <Link href="/settings/language">
              <div className="flex items-center justify-between hover:bg-muted/50 rounded-lg p-3 -m-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Languages className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{t('settings.languageRegion')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.interfaceDescription')}{currentLanguage === "arabic" ? "العربية" : 
                                         currentLanguage === "amharic" ? "አማርኛ" : "English"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </Card>

          {/* Account Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('settings.account')}</h3>
                <p className="text-sm text-muted-foreground">{t('settings.accountDescription')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="always-logged-in" className="text-base font-medium">{t('settings.stayLoggedIn')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.stayLoggedInDescription')}</p>
                </div>
                <Switch
                  id="always-logged-in"
                  checked={user?.alwaysLoggedIn || false}
                  onCheckedChange={handleAlwaysLoggedInToggle}
                  disabled={updateSettingsMutation.isPending}
                  data-testid="switch-always-logged-in"
                />
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('settings.privacy')}</h3>
                <p className="text-sm text-muted-foreground">{t('settings.privacyDescription')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Your Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                Delete Account
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('settings.notifications')}</h3>
                <p className="text-sm text-muted-foreground">{t('settings.notificationsDescription')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t('settings.studyReminders')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.studyRemindersDescription')}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{t('settings.progressUpdates')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.progressUpdatesDescription')}</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Footer Info */}
          <Card className="p-6 bg-muted/50">
            <div className="text-center">
              <h4 className="font-semibold text-sm mb-2">Learn Amharic</h4>
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <Button variant="link" className="h-auto p-0">Terms of Service</Button>
                <Button variant="link" className="h-auto p-0">Privacy Policy</Button>
                <Button variant="link" className="h-auto p-0">Support</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}