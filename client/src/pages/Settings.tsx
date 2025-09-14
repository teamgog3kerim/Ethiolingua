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

  const handleThemeChange = (theme: string) => {
    updateSettingsMutation.mutate({ theme });
    // Apply theme immediately to DOM
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // Default/system theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleAlwaysLoggedInToggle = (enabled: boolean) => {
    updateSettingsMutation.mutate({ alwaysLoggedIn: enabled });
  };

  const currentTheme = user?.theme || "default";

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
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
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
                <h3 className="font-semibold text-lg">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize how the app looks</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-select" className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground mb-3">Choose your preferred color scheme</p>
                <Select 
                  value={currentTheme} 
                  onValueChange={handleThemeChange}
                  disabled={updateSettingsMutation.isPending}
                >
                  <SelectTrigger className="w-full" data-testid="select-theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default" className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      <span>System Default</span>
                    </SelectItem>
                    <SelectItem value="light" className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      <span>Light Mode</span>
                    </SelectItem>
                    <SelectItem value="dark" className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      <span>Dark Mode</span>
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
                    <h3 className="font-semibold text-lg">Language & Region</h3>
                    <p className="text-sm text-muted-foreground">
                      Interface language: {user?.interfaceLanguage === "arabic" ? "العربية" : 
                                         user?.interfaceLanguage === "amharic" ? "አማርኛ" : "English"}
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
                <h3 className="font-semibold text-lg">Account</h3>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="always-logged-in" className="text-base font-medium">Stay Logged In</Label>
                  <p className="text-sm text-muted-foreground">Keep me signed in across sessions</p>
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
                <h3 className="font-semibold text-lg">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">Control your privacy and security</p>
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
                <h3 className="font-semibold text-lg">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to practice daily</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Progress Updates</Label>
                  <p className="text-sm text-muted-foreground">Weekly progress summaries</p>
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