import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Lesson from "@/pages/Lesson";
import Quiz from "@/pages/Quiz";
import AITutor from "@/pages/AITutor";
import Subscription from "@/pages/Subscription";
import Progress from "@/pages/Progress";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {!user?.nativeLanguage ? (
            <Route path="/" component={Onboarding} />
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/lesson/:id" component={Lesson} />
              <Route path="/quiz/:id" component={Quiz} />
              <Route path="/tutor" component={AITutor} />
              <Route path="/subscription" component={Subscription} />
              <Route path="/progress" component={Progress} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
