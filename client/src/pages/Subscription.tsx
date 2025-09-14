import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";



export default function Subscription() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    retry: false,
  });


  const handleUpgrade = () => {
    // Show instructions for Binance Pay
    toast({
      title: "Pay with Binance",
      description: "Use the QR code above to complete payment via Binance Pay. Payment ID: User-464cd",
    });
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time from your account settings. Your access will continue until the end of the current billing period."
    },
    {
      question: "Why use cryptocurrency payments?",
      answer: "Cryptocurrency payments through Binance Pay offer lower fees, faster processing, and better privacy compared to traditional payment methods."
    },
    {
      question: "What happens to my progress?",
      answer: "All your learning progress is saved and will carry over when you upgrade to Pro. You'll pick up right where you left off!"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-muted rounded-xl">
                <i className="fas fa-arrow-left text-muted-foreground"></i>
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-foreground" data-testid="title-upgrade">
              Upgrade to Pro
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-crown text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Unlock Your Full Potential</h2>
          <p className="text-lg text-muted-foreground mb-6">Get unlimited access to all features and accelerate your Amharic learning</p>
          
          {/* Trial Status */}
          <Card className="bg-primary/10 border border-primary/20 rounded-2xl p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <i className="fas fa-clock text-primary"></i>
              <span className="font-semibold text-primary">Free Trial Active</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-trial-progress">
              {stats?.completedLessons || 0} lessons completed, {20 - (stats?.completedLessons || 0)} remaining locked
            </p>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${Math.min(((stats?.completedLessons || 0) / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </Card>
        </div>

        {/* Payment Options */}
        <div className="flex justify-center max-w-2xl mx-auto mb-8">
          {/* Binance Pay Option (Only) */}
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-8 text-center text-white relative overflow-hidden border-2 border-yellow-400 w-full max-w-lg">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pattern-bg" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <i className="fas fa-star text-yellow-200"></i>
                <span className="text-sm font-medium">SECURE PAYMENT</span>
                <i className="fas fa-star text-yellow-200"></i>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Binance Pay</h3>
              <div className="mb-6">
                <div className="text-4xl font-bold">30 <span className="text-lg font-medium">USDT</span></div>
                <p className="text-sm opacity-90">per month via cryptocurrency</p>
              </div>
              
              {/* QR Code */}
              <div className="bg-white rounded-2xl p-4 mb-4">
                <img 
                  src="/attached_assets/binance-1757796747327 (2)_1757853481242.png" 
                  alt="Binance Pay QR Code" 
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>
              
              <div className="text-center mb-4">
                <p className="text-sm opacity-90 mb-2">Scan with Binance App to pay</p>
                <p className="text-xs opacity-75">User ID: User-464cd</p>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-white text-orange-500 font-bold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
                data-testid="button-binance-pay"
              >
                Pay with Binance (30 USDT)
              </Button>
              
              <p className="text-xs opacity-75 mt-3">Instant payment • Low fees • Secure</p>
            </div>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Free Trial */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <i className="fas fa-gift text-muted-foreground"></i>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Free Trial</h3>
                <p className="text-sm text-muted-foreground">Limited access</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">First 5 lessons</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">Text & audio content</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">Multiple choice quizzes</span>
              </li>
              <li className="flex items-center gap-3 opacity-60">
                <i className="fas fa-times text-muted-foreground w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-muted-foreground">Limited AI tutor</span>
              </li>
              <li className="flex items-center gap-3 opacity-60">
                <i className="fas fa-times text-muted-foreground w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-muted-foreground">No speech scoring</span>
              </li>
              <li className="flex items-center gap-3 opacity-60">
                <i className="fas fa-times text-muted-foreground w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-muted-foreground">No live tutors</span>
              </li>
            </ul>
          </Card>
          
          {/* Pro Subscription */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 relative">
            <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
              RECOMMENDED
            </Badge>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-crown text-primary"></i>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Pro Subscription</h3>
                <p className="text-sm text-muted-foreground">Full access</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">All 625+ lessons</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">Unlimited AI tutor</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">Speech scoring & feedback</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">Live tutor sessions</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">Progress certificates</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-primary w-4 h-4 flex-shrink-0"></i>
                <span className="text-sm text-foreground">Priority support</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="bg-muted/50 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-foreground mb-4 text-center">Secure USDT Payment</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">USDT</span>
            </div>
            <span className="text-sm text-muted-foreground ml-2">Tether (USDT) only</span>
          </div>
          <p className="text-sm text-center text-muted-foreground">Fast, secure, and stable USDT payments via Binance Pay</p>
        </Card>

        {/* FAQs */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-foreground text-center mb-4">Frequently Asked Questions</h3>
          
          {faqs.map((faq, index) => (
            <Card key={index} className="p-4">
              <Button
                variant="ghost"
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex items-center justify-between p-0 h-auto"
                data-testid={`button-faq-${index}`}
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <i className={`fas fa-chevron-${expandedFAQ === index ? 'up' : 'down'} text-muted-foreground`}></i>
              </Button>
              {expandedFAQ === index && (
                <div className="mt-3 text-sm text-muted-foreground" data-testid={`text-faq-answer-${index}`}>
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            data-testid="button-upgrade-now"
          >
            <i className="fas fa-crown mr-2"></i>
            Upgrade to Pro Now
          </Button>
          <p className="text-sm text-muted-foreground mt-3">30 USDT/month • Pay with crypto • Instant access</p>
        </div>
      </main>
    </div>
  );
}
