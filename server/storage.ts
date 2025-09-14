import {
  users,
  lessons,
  userProgress,
  userStreaks,
  tutorConversations,
  liveTutors,
  tutorSessions,
  type User,
  type UpsertUser,
  type Lesson,
  type UserProgress,
  type UserStreak,
  type TutorConversation,
  type LiveTutor,
  type TutorSession,
  type InsertUserProgress,
  type InsertUserStreak,
  type InsertTutorConversation,
  type InsertLiveTutor,
  type InsertTutorSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateSubscriptionStatus(userId: string, status: string): Promise<User>;
  
  // Lesson operations
  getAllLessons(): Promise<Lesson[]>;
  getLessons(): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonsByLevel(level: string): Promise<Lesson[]>;
  updateLessonAudio(lessonId: number, audioUrl: string, slowAudioUrl: string): Promise<Lesson>;
  
  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserLessonProgress(userId: string, lessonId: number): Promise<UserProgress | undefined>;
  
  // Streak operations
  getUserStreak(userId: string): Promise<UserStreak | undefined>;
  updateUserStreak(userId: string, streak: Partial<InsertUserStreak>): Promise<UserStreak>;
  
  // AI Tutor operations
  getUserConversations(userId: string): Promise<TutorConversation[]>;
  createConversation(conversation: InsertTutorConversation): Promise<TutorConversation>;
  updateConversation(id: string, messages: any[]): Promise<TutorConversation>;
  
  // Live Tutor operations
  getAllTutors(): Promise<LiveTutor[]>;
  getAvailableTutors(date?: Date): Promise<LiveTutor[]>;
  getTutor(id: string): Promise<LiveTutor | undefined>;
  createTutor(tutor: InsertLiveTutor): Promise<LiveTutor>;
  updateTutor(id: string, updates: Partial<InsertLiveTutor>): Promise<LiveTutor>;
  
  // Session booking operations
  getUserSessions(userId: string): Promise<TutorSession[]>;
  getTutorSessions(tutorId: string): Promise<TutorSession[]>;
  getSession(id: string): Promise<TutorSession | undefined>;
  createSession(session: InsertTutorSession): Promise<TutorSession>;
  updateSession(id: string, updates: Partial<InsertTutorSession>): Promise<TutorSession>;
  cancelSession(id: string): Promise<TutorSession>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }


  async updateSubscriptionStatus(userId: string, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Lesson operations
  async getAllLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons).orderBy(lessons.orderIndex);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async getLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons).orderBy(lessons.orderIndex);
  }

  async getLessonsByLevel(level: string): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.level, level)).orderBy(lessons.orderIndex);
  }

  async updateLessonAudio(lessonId: number, audioUrl: string, slowAudioUrl: string): Promise<Lesson> {
    const [lesson] = await db
      .update(lessons)
      .set({
        audioUrl,
        slowAudioUrl,
      })
      .where(eq(lessons.id, lessonId))
      .returning();
    return lesson;
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [existing] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, progress.userId),
          eq(userProgress.lessonId, progress.lessonId)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({
          ...progress,
          completedAt: progress.completed ? new Date() : existing.completedAt,
        })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values({
          ...progress,
          completedAt: progress.completed ? new Date() : undefined,
        })
        .returning();
      return created;
    }
  }

  async getUserLessonProgress(userId: string, lessonId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.lessonId, lessonId)
        )
      );
    return progress;
  }

  // Streak operations
  async getUserStreak(userId: string): Promise<UserStreak | undefined> {
    const [streak] = await db.select().from(userStreaks).where(eq(userStreaks.userId, userId));
    return streak;
  }

  async updateUserStreak(userId: string, streakData: Partial<InsertUserStreak>): Promise<UserStreak> {
    const existing = await this.getUserStreak(userId);
    
    if (existing) {
      const [updated] = await db
        .update(userStreaks)
        .set({
          ...streakData,
          updatedAt: new Date(),
        })
        .where(eq(userStreaks.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userStreaks)
        .values({
          userId,
          ...streakData,
        })
        .returning();
      return created;
    }
  }

  // AI Tutor operations
  async getUserConversations(userId: string): Promise<TutorConversation[]> {
    return await db
      .select()
      .from(tutorConversations)
      .where(eq(tutorConversations.userId, userId))
      .orderBy(desc(tutorConversations.updatedAt));
  }

  async createConversation(conversation: InsertTutorConversation): Promise<TutorConversation> {
    const [created] = await db
      .insert(tutorConversations)
      .values(conversation)
      .returning();
    return created;
  }

  async updateConversation(id: string, messages: any[]): Promise<TutorConversation> {
    const [updated] = await db
      .update(tutorConversations)
      .set({
        messages,
        updatedAt: new Date(),
      })
      .where(eq(tutorConversations.id, id))
      .returning();
    return updated;
  }

  // Live Tutor operations
  async getAllTutors(): Promise<LiveTutor[]> {
    return await db
      .select()
      .from(liveTutors)
      .where(eq(liveTutors.isActive, true))
      .orderBy(desc(liveTutors.rating));
  }

  async getAvailableTutors(date?: Date): Promise<LiveTutor[]> {
    // For now, return all active tutors
    // In a real implementation, you'd filter by availability and existing bookings
    return await this.getAllTutors();
  }

  async getTutor(id: string): Promise<LiveTutor | undefined> {
    const [tutor] = await db.select().from(liveTutors).where(eq(liveTutors.id, id));
    return tutor;
  }

  async createTutor(tutor: InsertLiveTutor): Promise<LiveTutor> {
    const [created] = await db
      .insert(liveTutors)
      .values(tutor)
      .returning();
    return created;
  }

  async updateTutor(id: string, updates: Partial<InsertLiveTutor>): Promise<LiveTutor> {
    const [updated] = await db
      .update(liveTutors)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(liveTutors.id, id))
      .returning();
    return updated;
  }

  // Session booking operations
  async getUserSessions(userId: string): Promise<TutorSession[]> {
    return await db
      .select()
      .from(tutorSessions)
      .where(eq(tutorSessions.studentId, userId))
      .orderBy(desc(tutorSessions.scheduledAt));
  }

  async getTutorSessions(tutorId: string): Promise<TutorSession[]> {
    return await db
      .select()
      .from(tutorSessions)
      .where(eq(tutorSessions.tutorId, tutorId))
      .orderBy(desc(tutorSessions.scheduledAt));
  }

  async getSession(id: string): Promise<TutorSession | undefined> {
    const [session] = await db.select().from(tutorSessions).where(eq(tutorSessions.id, id));
    return session;
  }

  async createSession(session: InsertTutorSession): Promise<TutorSession> {
    const [created] = await db
      .insert(tutorSessions)
      .values({
        ...session,
        meetingRoomId: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
      .returning();
    return created;
  }

  async updateSession(id: string, updates: Partial<InsertTutorSession>): Promise<TutorSession> {
    const [updated] = await db
      .update(tutorSessions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tutorSessions.id, id))
      .returning();
    return updated;
  }

  async cancelSession(id: string): Promise<TutorSession> {
    const [cancelled] = await db
      .update(tutorSessions)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(tutorSessions.id, id))
      .returning();
    return cancelled;
  }
}

export const storage = new DatabaseStorage();
