import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  TrendingUp, 
  Dumbbell, 
  Crown, 
  Bot, 
  Video, 
  Languages, 
  Settings, 
  X, 
  LogOut,
  HelpCircle,
  Headphones,
  Star
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [autoHideTimer, setAutoHideTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide functionality
  useEffect(() => {
    if (isOpen && autoHideTimer) {
      clearTimeout(autoHideTimer);
      setAutoHideTimer(null);
    }
  }, [isOpen, autoHideTimer]);

  const handleMouseLeave = () => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onToggle();
      }, 2000); // Auto-hide after 2 seconds of inactivity
      setAutoHideTimer(timer);
    }
  };

  const handleMouseEnter = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
      setAutoHideTimer(null);
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      active: location === "/",
    },
    {
      icon: TrendingUp,
      label: "Your Progress",
      href: "/progress",
      active: location === "/progress",
    },
    {
      icon: Dumbbell,
      label: "Quick Practice",
      href: "/pronunciation/1",
      active: location.startsWith("/pronunciation"),
    },
    {
      icon: Crown,
      label: "Pricing",
      href: "/subscription",
      active: location === "/subscription",
    },
    {
      icon: Bot,
      label: "AI Tutor",
      href: "/tutor",
      active: location === "/tutor",
    },
    {
      icon: Video,
      label: "Live Tutors",
      href: "/tutors",
      active: location === "/tutors",
    },
  ];

  const getUserInitials = () => {
    if (!user?.firstName && !user?.lastName) return "U";
    return `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-card border-r border-border z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-80" : "w-0"
        } overflow-hidden shadow-xl`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">አ</span>
              </div>
              <h2 className="font-bold text-lg text-foreground">Learn Amharic</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-8 h-8"
              data-testid="button-close-sidebar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          {/* User Profile Section */}
          {isAuthenticated && user && (
            <Card className="m-4 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.profileImageUrl || undefined} alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate" data-testid="text-user-name">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.email?.split("@")[0] || "User"
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground truncate" data-testid="text-user-email">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant={user.subscriptionStatus === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.subscriptionStatus === "active" ? "Pro" : "Free Trial"}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Languages className="w-3 h-3" />
                  <span className="capitalize">{user.nativeLanguage || "English"}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 pb-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 text-left font-medium transition-all duration-200 ${
                      item.active 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-muted hover:text-foreground"
                    }`}
                    onClick={onToggle}
                    data-testid={`button-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.label === "Pricing" && user?.subscriptionStatus !== "active" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Upgrade
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Language & Settings */}
            <div className="space-y-2">
              <Link href="/settings/language">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 hover:bg-muted"
                  onClick={onToggle}
                  data-testid="button-nav-language"
                >
                  <Languages className="w-5 h-5" />
                  <span>Language</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {user?.interfaceLanguage === "arabic" ? "العربية" : 
                     user?.interfaceLanguage === "amharic" ? "አማርኛ" : "English"}
                  </Badge>
                </Button>
              </Link>

              <Link href="/settings">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 hover:bg-muted"
                  onClick={onToggle}
                  data-testid="button-nav-settings"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Button>
              </Link>
            </div>

            {/* Logout */}
            {isAuthenticated && (
              <>
                <Separator className="my-6" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
                  onClick={() => {
                    window.location.href = "/api/logout";
                  }}
                  data-testid="button-logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Learn Amharic v1.0</p>
              <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <HelpCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Headphones className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button (when closed) */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          className="fixed top-4 left-4 z-40 w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300"
          data-testid="button-open-sidebar"
        >
          <i className="fas fa-bars text-primary-foreground"></i>
        </Button>
      )}
    </>
  );
}