import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const SubscriptionForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?subscription=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to Pro! You now have unlimited access.",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-8 rounded-2xl"
        data-testid="button-subscribe"
      >
        {isProcessing ? "Processing..." : "Subscribe Now"}
      </Button>
    </form>
  );
};

export default function Subscription() {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  const subscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/get-or-create-subscription");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initiate subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = () => {
    subscriptionMutation.mutate();
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

  if (showPayment && clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowPayment(false)}
                className="w-10 h-10 bg-muted rounded-xl"
              >
                <i className="fas fa-arrow-left text-muted-foreground"></i>
              </Button>
              <h1 className="text-lg font-bold text-foreground">Complete Payment</h1>
              <div className="w-10"></div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-crown text-white text-2xl"></i>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Upgrade to Pro</h2>
              <p className="text-muted-foreground">$30 USD per month</p>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscriptionForm clientSecret={clientSecret} />
            </Elements>
          </Card>
        </main>
      </div>
    );
  }

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

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-8">
          <Card className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-center text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pattern-bg" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <i className="fas fa-star text-secondary"></i>
                <span className="text-sm font-medium">Most Popular</span>
                <i className="fas fa-star text-secondary"></i>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Pro Subscription</h3>
              <div className="mb-6">
                <div className="text-4xl font-bold">$30 <span className="text-lg font-medium">USD</span></div>
                <p className="text-sm opacity-90">per month via Stripe</p>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                disabled={subscriptionMutation.isPending}
                className="w-full bg-white text-primary font-bold py-4 px-6 rounded-2xl hover:bg-white/90 transition-colors shadow-lg"
                data-testid="button-start-subscription"
              >
                {subscriptionMutation.isPending ? "Setting up..." : "Subscribe with Stripe"}
              </Button>
              
              <p className="text-xs opacity-75 mt-3">Cancel anytime • Secure payments</p>
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
          <h3 className="font-bold text-foreground mb-4 text-center">Secure Payment via Stripe</h3>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <i className="fab fa-cc-visa text-white text-xl"></i>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <i className="fab fa-cc-mastercard text-white text-xl"></i>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <i className="fab fa-cc-amex text-white text-xl"></i>
            </div>
            <div className="text-muted-foreground">+ more</div>
          </div>
          <p className="text-sm text-center text-muted-foreground">Fast, secure, and reliable payments</p>
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
            disabled={subscriptionMutation.isPending}
            className="bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            data-testid="button-upgrade-now"
          >
            <i className="fas fa-crown mr-2"></i>
            {subscriptionMutation.isPending ? "Setting up..." : "Upgrade to Pro Now"}
          </Button>
          <p className="text-sm text-muted-foreground mt-3">$30 USD/month • Cancel anytime • Instant access</p>
        </div>
      </main>
    </div>
  );
}
