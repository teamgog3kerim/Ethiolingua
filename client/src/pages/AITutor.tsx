import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome! I'm your AI tutor. Let's practice what you've learned. Can you tell me what letter this is?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: conversations } = useQuery({
    queryKey: ["/api/tutor/conversations"],
    retry: false,
  });

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; conversationId?: string }) => {
      const response = await apiRequest("POST", "/api/tutor/chat", data);
      return response.json();
    },
    onSuccess: (data) => {
      setConversationId(data.conversation.id);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }
      ]);
    },
    onError: (error) => {
      const errorMessage = error.message;
      if (errorMessage.includes("Upgrade to Pro")) {
        toast({
          title: "Upgrade Required",
          description: "Upgrade to Pro for unlimited AI tutor conversations",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to get AI response. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    chatMutation.mutate({
      message: inputMessage,
      conversationId: conversationId || undefined,
    });

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Tutor Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-muted rounded-xl">
                <i className="fas fa-arrow-left text-muted-foreground"></i>
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                <i className="fas fa-robot text-white"></i>
              </div>
              <div>
                <h2 className="font-bold text-foreground" data-testid="text-tutor-name">AI Tutor</h2>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="w-10 h-10 bg-muted rounded-xl">
              <i className="fas fa-ellipsis-h text-muted-foreground"></i>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
              )}
              
              <div className={`flex-1 max-w-xs ${message.role === 'user' ? 'order-first' : ''}`}>
                <Card className={`p-4 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm ml-auto' 
                    : 'bg-card border border-border rounded-tl-sm'
                }`}>
                  <p className={message.role === 'user' ? 'text-primary-foreground' : 'text-foreground'}>
                    {message.content}
                  </p>
                  
                  {/* Add example Amharic character for first message */}
                  {index === 0 && message.role === 'assistant' && (
                    <div className="mt-3 p-3 bg-muted rounded-xl text-center">
                      <div className="amharic-text text-4xl text-primary font-bold">አ</div>
                    </div>
                  )}
                </Card>
                <p className={`text-xs text-muted-foreground mt-1 ${
                  message.role === 'user' ? 'text-right mr-4' : 'ml-4'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-sm font-bold">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          {chatMutation.isPending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <Card className="bg-card border border-border rounded-2xl rounded-tl-sm p-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="icon" className="w-10 h-10 bg-muted rounded-xl">
              <i className="fas fa-microphone text-muted-foreground"></i>
            </Button>
            
            <div className="flex-1 bg-muted rounded-2xl px-4 py-3 min-h-[44px] flex items-center">
              <Input
                type="text"
                placeholder="Type your response or ask a question..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground p-0 h-auto focus-visible:ring-0"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={chatMutation.isPending}
                data-testid="input-chat-message"
              />
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              size="icon" 
              className="w-10 h-10 rounded-xl"
              data-testid="button-send-message"
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
          
          {/* Pro upgrade notice */}
          {user?.subscriptionStatus !== 'active' && (
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                AI Tutor conversations are limited in free trial. 
                <Link href="/subscription">
                  <Button variant="link" className="text-primary hover:underline font-medium p-0 ml-1 h-auto">
                    Upgrade to Pro
                  </Button>
                </Link> 
                for unlimited conversations.
              </p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
