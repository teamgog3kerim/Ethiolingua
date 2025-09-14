import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, MessageSquare, ArrowLeft } from "lucide-react";

export default function Tutors() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Live Tutors</h1>
              <p className="text-muted-foreground">Practice with native Amharic speakers</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Coming Soon Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="h-12 w-12 text-white" />
          </div>

          {/* Coming Soon Content */}
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Coming Soon!
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're working hard to bring you live tutoring sessions with native Amharic speakers. 
            This exciting feature will be available soon!
          </p>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Native Speakers</h3>
              <p className="text-sm text-muted-foreground">
                Connect with qualified Amharic tutors from Ethiopia
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Live Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Practice speaking in real-time video sessions
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Book sessions that fit your schedule
              </p>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-muted-foreground">
              In the meantime, continue your Amharic journey with our interactive lessons!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/lessons">
                <Button size="lg" data-testid="button-continue-lessons">
                  Continue Learning
                </Button>
              </Link>
              <Link href="/ai-tutor">
                <Button variant="outline" size="lg" data-testid="button-ai-tutor">
                  Try AI Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}