import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center relative overflow-hidden">
      {/* Ethiopian cultural pattern background */}
      <div className="absolute inset-0 opacity-10 pattern-bg" />
      
      <div className="text-center z-10 px-6 max-w-md mx-auto">
        {/* App Icon/Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
            <div className="amharic-text text-4xl text-white font-bold">አ</div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg">
            <i className="fas fa-microphone text-white text-sm"></i>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2" data-testid="title-main">
          Learn Amharic
        </h1>
        <p className="text-white/90 text-lg mb-2">AI-Powered Language Learning</p>
        <p className="text-white/75 text-sm mb-8">For English & Arabic Speakers</p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleSignIn}
            className="w-full bg-white text-primary font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-auto"
            data-testid="button-sign-in"
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
            className="w-full bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-8 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
            data-testid="button-existing-account"
          >
            Already have an account? Sign In
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-white/60">
          <div className="text-center">
            <i className="fas fa-users text-2xl mb-2"></i>
            <p className="text-xs">10K+ Learners</p>
          </div>
          <div className="text-center">
            <i className="fas fa-star text-2xl mb-2"></i>
            <p className="text-xs">4.9 Rating</p>
          </div>
          <div className="text-center">
            <i className="fas fa-globe text-2xl mb-2"></i>
            <p className="text-xs">2 Languages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
