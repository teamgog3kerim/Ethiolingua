import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth and app data
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  nativeLanguage: varchar("native_language").notNull().default("english"), // english, arabic
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("trial"), // trial, active, canceled, expired
  trialEndsAt: timestamp("trial_ends_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons table with structured content
export const lessons = pgTable("lessons", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  category: varchar("category").notNull(), // alphabet, vocabulary, grammar, etc.
  level: varchar("level").notNull().default("beginner"), // beginner, intermediate, advanced
  orderIndex: integer("order_index").notNull(),
  content: jsonb("content").notNull(), // { amharic: [], english: [], arabic: [] }
  audioUrl: varchar("audio_url"),
  slowAudioUrl: varchar("slow_audio_url"),
  quizQuestions: jsonb("quiz_questions").notNull(), // array of quiz questions
  objectives: jsonb("objectives").notNull(), // array of learning objectives
  isPremium: boolean("is_premium").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"), // quiz score percentage
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent_seconds").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning streaks
export const userStreaks = pgTable("user_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI tutor conversations
export const tutorConversations = pgTable("tutor_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messages: jsonb("messages").notNull(), // array of { role, content, timestamp }
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  streaks: many(userStreaks),
  conversations: many(tutorConversations),
}));

export const lessonsRelations = relations(lessons, ({ many }) => ({
  progress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  nativeLanguage: true,
});

export const insertLessonSchema = createInsertSchema(lessons);
export const insertUserProgressSchema = createInsertSchema(userProgress);
export const insertUserStreakSchema = createInsertSchema(userStreaks);
export const insertTutorConversationSchema = createInsertSchema(tutorConversations);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserStreak = typeof userStreaks.$inferSelect;
export type TutorConversation = typeof tutorConversations.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type InsertTutorConversation = z.infer<typeof insertTutorConversationSchema>;
