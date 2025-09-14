import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import Stripe from "stripe";
import { OpenAIService } from "./services/openai";

// Initialize Stripe only if API key is available
const isStripeEnabled = !!process.env.STRIPE_SECRET_KEY;
const stripe = isStripeEnabled ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
}) : null;

if (!isStripeEnabled) {
  console.warn('Stripe API key not found. Subscription features will be disabled.');
}

const openaiService = new OpenAIService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Onboarding - set native language
  app.post('/api/onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const { nativeLanguage } = req.body;
      const userId = req.user.claims.sub;
      
      if (!nativeLanguage || !['english', 'arabic'].includes(nativeLanguage)) {
        return res.status(400).json({ message: "Invalid native language" });
      }

      const user = await storage.upsertUser({
        id: userId,
        nativeLanguage,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
      });

      res.json(user);
    } catch (error) {
      console.error("Error in onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Lessons
  app.get('/api/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const lessons = await storage.getAllLessons();
      const userProgress = await storage.getUserProgress(userId);
      
      const lessonsWithProgress = lessons.map(lesson => {
        const progress = userProgress.find(p => p.lessonId === lesson.id);
        const canAccess = lesson.orderIndex <= 5 || user?.subscriptionStatus === 'active';
        
        return {
          ...lesson,
          completed: progress?.completed || false,
          score: progress?.score,
          canAccess,
        };
      });

      res.json(lessonsWithProgress);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get('/api/lessons/:id', isAuthenticated, async (req: any, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check access
      const canAccess = lesson.orderIndex <= 5 || user?.subscriptionStatus === 'active';
      if (!canAccess) {
        return res.status(403).json({ message: "Upgrade to Pro to access this lesson" });
      }

      const progress = await storage.getUserLessonProgress(userId, lessonId);
      
      res.json({
        ...lesson,
        completed: progress?.completed || false,
        score: progress?.score,
      });
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Progress tracking
  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { lessonId, completed, score, timeSpent } = req.body;
      
      const progress = await storage.createOrUpdateProgress({
        userId,
        lessonId,
        completed,
        score,
        timeSpent,
      });

      // Update streak if lesson completed
      if (completed) {
        const streak = await storage.getUserStreak(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!streak?.lastActivityDate || new Date(streak.lastActivityDate) < today) {
          const newStreak = (streak?.currentStreak || 0) + 1;
          await storage.updateUserStreak(userId, {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak?.longestStreak || 0),
            lastActivityDate: new Date(),
          });
        }
      }

      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // User stats
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      const streak = await storage.getUserStreak(userId);
      
      const completedLessons = progress.filter(p => p.completed).length;
      const totalTime = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
      const averageScore = progress.length > 0 
        ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length 
        : 0;

      res.json({
        completedLessons,
        totalTimeMinutes: Math.round(totalTime / 60),
        averageScore: Math.round(averageScore),
        currentStreak: streak?.currentStreak || 0,
        longestStreak: streak?.longestStreak || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // AI Tutor Chat
  app.post('/api/tutor/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, conversationId } = req.body;
      const user = await storage.getUser(userId);

      // Limit free users
      if (user?.subscriptionStatus !== 'active') {
        const conversations = await storage.getUserConversations(userId);
        const totalMessages = conversations.reduce((sum, conv) => sum + (conv.messages as any[]).length, 0);
        
        if (totalMessages >= 20) { // 20 message limit for free users
          return res.status(403).json({ message: "Upgrade to Pro for unlimited AI tutor conversations" });
        }
      }

      let conversation;
      if (conversationId) {
        const conversations = await storage.getUserConversations(userId);
        conversation = conversations.find(c => c.id === conversationId);
      }

      const messages = conversation ? (conversation.messages as any[]) : [];
      messages.push({ role: 'user', content: message, timestamp: new Date() });

      // Get AI response
      const aiResponse = await openaiService.getChatResponse(messages, user?.nativeLanguage || 'english');
      messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() });

      if (conversation) {
        conversation = await storage.updateConversation(conversation.id, messages);
      } else {
        conversation = await storage.createConversation({
          userId,
          messages,
        });
      }

      res.json({ 
        conversation,
        response: aiResponse 
      });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // Subscription management
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      if (!isStripeEnabled || !stripe) {
        return res.status(503).json({ 
          error: { message: "Payment processing is temporarily unavailable. Please try again later." }
        });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (user?.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string, {
          expand: ['payment_intent']
        });

        res.json({
          subscriptionId: subscription.id,
          clientSecret: (invoice.payment_intent as any)?.client_secret,
        });
        return;
      }

      if (!user?.email) {
        throw new Error('No user email on file');
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Learn Amharic Pro Subscription',
            },
            unit_amount: 3000, // $30 USD equivalent
            recurring: {
              interval: 'month',
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription error:", error);
      res.status(400).json({ error: { message: error.message } });
    }
  });

  // Webhook to handle subscription updates
  app.post('/api/webhooks/stripe', async (req, res) => {
    try {
      if (!isStripeEnabled || !stripe) {
        return res.status(503).json({ error: "Payment processing is not configured" });
      }

      const event = req.body;

      if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(event.data.object.subscription);
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        // Update user subscription status
        // Note: This is simplified - in production you'd want to find user by customer ID
        // For now, we'll handle this via the frontend after successful payment
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).send('Webhook Error');
    }
  });

  // Audio generation route (authenticated users for testing)
  app.post('/api/generate-lesson-audio', isAuthenticated, async (req: any, res) => {
    try {
      const { lessonId } = req.body;
      
      if (!lessonId) {
        return res.status(400).json({ error: "Lesson ID is required" });
      }

      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      // Extract Amharic text from lesson content
      const content = lesson.content as any;
      const amharicTexts = content?.amharic || [];
      
      if (amharicTexts.length === 0) {
        return res.status(400).json({ error: "No Amharic content found for this lesson" });
      }

      // Generate audio for the first few key phrases
      const textToSpeak = amharicTexts.slice(0, 3).join('. '); // First 3 phrases
      const filename = `lesson${lessonId}`;
      
      const audioUrls = await openaiService.generateAndSaveAudio(textToSpeak, filename);
      
      // Update lesson with audio URLs
      await storage.updateLessonAudio(lessonId, audioUrls.normalUrl, audioUrls.slowUrl);

      res.json({ 
        success: true, 
        audioUrl: audioUrls.normalUrl,
        slowAudioUrl: audioUrls.slowUrl
      });
    } catch (error) {
      console.error("Error generating lesson audio:", error);
      res.status(500).json({ error: "Failed to generate audio" });
    }
  });

  // Bulk generate audio for all lessons (authenticated users for testing)
  app.post('/api/generate-all-audio', isAuthenticated, async (req: any, res) => {
    try {
      const lessons = await storage.getLessons();
      const results = [];

      for (const lesson of lessons.slice(0, 10)) { // Limit to first 10 to avoid timeout
        try {
          const content = lesson.content as any;
          const amharicTexts = content?.amharic || [];
          
          if (amharicTexts.length > 0) {
            const textToSpeak = amharicTexts.slice(0, 2).join('. '); // First 2 phrases
            const filename = `lesson${lesson.id}`;
            
            const audioUrls = await openaiService.generateAndSaveAudio(textToSpeak, filename);
            await storage.updateLessonAudio(lesson.id, audioUrls.normalUrl, audioUrls.slowUrl);
            
            results.push({ lessonId: lesson.id, success: true, ...audioUrls });
          }
        } catch (error) {
          console.error(`Error generating audio for lesson ${lesson.id}:`, error);
          results.push({ lessonId: lesson.id, success: false, error: error.message });
        }
      }

      res.json({ results });
    } catch (error) {
      console.error("Error in bulk audio generation:", error);
      res.status(500).json({ error: "Failed to generate audio" });
    }
  });

  // Pronunciation practice results
  app.post('/api/pronunciation-practice', isAuthenticated, async (req: any, res) => {
    try {
      // Validate input
      const practiceSchema = z.object({
        lessonId: z.number().int().positive(),
        scores: z.array(z.number().min(0).max(100)),
        averageScore: z.number().min(0).max(100),
      });

      const { lessonId, scores, averageScore } = practiceSchema.parse(req.body);
      const userId = req.user.claims.sub;

      // Check if lesson exists
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      // Save pronunciation practice results WITHOUT marking lesson as completed
      // This is separate from lesson completion - it's just practice data
      const practiceData = {
        userId,
        lessonId,
        completed: false, // Don't mark lesson as completed for pronunciation practice
        score: averageScore,
        timeSpent: 300, // 5 minutes default for pronunciation practice
        metadata: { 
          pronunciationScores: scores,
          practiceType: 'pronunciation',
          practiceDate: new Date().toISOString()
        },
      };

      await storage.createOrUpdateProgress(practiceData);

      res.json({ success: true, averageScore, practiceDate: new Date().toISOString() });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid input data", 
          details: error.errors 
        });
      }
      console.error("Error saving pronunciation practice:", error);
      res.status(500).json({ error: "Failed to save practice results" });
    }
  });

  // Live tutor booking routes
  app.get('/api/tutors', isAuthenticated, async (req: any, res) => {
    try {
      const tutors = await storage.getAllTutors();
      res.json(tutors);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      res.status(500).json({ error: "Failed to fetch tutors" });
    }
  });

  app.get('/api/tutors/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const tutor = await storage.getTutor(id);
      
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }
      
      res.json(tutor);
    } catch (error) {
      console.error("Error fetching tutor:", error);
      res.status(500).json({ error: "Failed to fetch tutor" });
    }
  });

  app.post('/api/sessions/book', isAuthenticated, async (req: any, res) => {
    try {
      const { tutorId, scheduledAt, duration, sessionType, notes } = req.body;
      const userId = req.user.claims.sub;
      
      // Validate input
      if (!tutorId || !scheduledAt) {
        return res.status(400).json({ error: "Tutor ID and scheduled time are required" });
      }

      // Check if tutor exists
      const tutor = await storage.getTutor(tutorId);
      if (!tutor) {
        return res.status(404).json({ error: "Tutor not found" });
      }

      // Calculate cost
      const sessionDuration = duration || 60;
      const totalCost = Math.round((tutor.hourlyRate / 60) * sessionDuration);

      const sessionData = {
        studentId: userId,
        tutorId,
        scheduledAt: new Date(scheduledAt),
        duration: sessionDuration,
        sessionType: sessionType || 'conversation',
        notes,
        totalCost,
        status: 'scheduled' as const,
        paymentStatus: 'pending' as const,
      };

      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error booking session:", error);
      res.status(500).json({ error: "Failed to book session" });
    }
  });

  app.get('/api/sessions/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get('/api/sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Only allow access to student's own sessions
      if (session.studentId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.put('/api/sessions/:id/cancel', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      if (session.studentId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      if (session.status === 'completed') {
        return res.status(400).json({ error: "Cannot cancel completed session" });
      }

      const cancelledSession = await storage.cancelSession(id);
      res.json(cancelledSession);
    } catch (error) {
      console.error("Error cancelling session:", error);
      res.status(500).json({ error: "Failed to cancel session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
