import {
  users,
  lessons,
  userProgress,
  userStreaks,
  tutorConversations,
  type User,
  type UpsertUser,
  type Lesson,
  type UserProgress,
  type UserStreak,
  type TutorConversation,
  type InsertUserProgress,
  type InsertUserStreak,
  type InsertTutorConversation,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
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

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: "active",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
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
}

export const storage = new DatabaseStorage();
