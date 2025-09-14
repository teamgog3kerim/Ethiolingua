import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Users, Star, Globe } from "lucide-react";
import { useEffect } from "react";

export default function Landing() {
  useEffect(() => {
    // Set document title and meta description for SEO
    document.title = "Learn Amharic - AI-Powered Language Learning | AmharicAI";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn Amharic with AI-powered lessons designed for English and Arabic speakers. Start your free trial with 5 lessons and join 10,000+ learners mastering Ethiopian language.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn Amharic with AI-powered lessons designed for English and Arabic speakers. Start your free trial with 5 lessons and join 10,000+ learners mastering Ethiopian language.';
      document.head.appendChild(meta);
    }

    // Set language attribute
    document.documentElement.lang = 'en';
    
    return () => {
      // Reset title when component unmounts
      document.title = 'AmharicAI - Learn Amharic Language';
    };
  }, []);
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center relative overflow-hidden">
      {/* Ethiopian cultural pattern background */}
      <div className="absolute inset-0 opacity-10 pattern-bg" />
      
      <div className="text-center z-10 px-4 sm:px-6 lg:px-8 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {/* App Icon/Logo */}
        <div className="mb-6 sm:mb-8 relative" data-testid="logo-container">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl" aria-label="Learn Amharic App Logo">
            <div className="amharic-text text-3xl sm:text-4xl lg:text-5xl text-white font-bold" role="img" aria-label="Amharic letter Alef">አ</div>
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg" aria-label="Voice feature indicator">
            <Mic className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/95 mb-2 leading-tight" data-testid="title-main">
          Learn Amharic
        </h1>
        <p className="text-white/90 text-base sm:text-lg lg:text-xl mb-2">AI-Powered Language Learning</p>
        <p className="text-white/75 text-sm sm:text-base mb-6 sm:mb-8">For English & Arabic Speakers</p>
        
        <div className="space-y-3 sm:space-y-4">
          <Button 
            onClick={handleSignIn}
            className="w-full md:w-auto md:px-12 bg-white text-primary font-semibold py-4 px-6 sm:px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-auto min-h-[3rem]"
            data-testid="button-sign-in"
            aria-label="Start free trial - First 5 lessons free"
          >
            <div>
              Start Free Trial
              <div className="text-sm text-muted-foreground font-normal">
                First 5 lessons free
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSignIn}
            className="w-full md:w-auto md:px-12 bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-6 sm:px-8 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 min-h-[2.75rem]"
            data-testid="button-existing-account"
            aria-label="Sign in to existing account"
          >
            Already have an account? Sign In
          </Button>
        </div>
        
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-white/60 max-w-xs sm:max-w-sm mx-auto">
          <div className="text-center" data-testid="stat-learners">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 mx-auto" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-medium">10K+ Learners</p>
          </div>
          <div className="text-center" data-testid="stat-rating">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 mx-auto" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-medium">4.9 Rating</p>
          </div>
          <div className="text-center" data-testid="stat-languages">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 mx-auto" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-medium">2 Languages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
