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
  password: varchar("password"), // for email/password authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  age: integer("age"),
  sex: varchar("sex"), // male, female, other, prefer_not_to_say
  country: varchar("country"),
  profession: varchar("profession"),
  nativeLanguage: varchar("native_language").notNull().default("english"), // english, arabic, chinese, amharic
  interfaceLanguage: varchar("interface_language").notNull().default("english"), // english, arabic, chinese, amharic
  theme: varchar("theme").default("default"), // light, dark, default
  alwaysLoggedIn: boolean("always_logged_in").default(false),
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
  content: jsonb("content").notNull(), // { amharic: [], chinese: [], arabic: [], english: [] }
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

// Live tutors
export const liveTutors = pgTable("live_tutors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  specialties: jsonb("specialties").notNull(), // array of specialties: ["beginner", "pronunciation", "conversation"]
  languages: jsonb("languages").notNull(), // native languages the tutor speaks
  hourlyRate: integer("hourly_rate").notNull(), // rate in cents (USD)
  availability: jsonb("availability").notNull(), // weekly schedule with time slots
  rating: integer("rating").default(500), // out of 500 (5.00 stars * 100)
  totalSessions: integer("total_sessions").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tutor booking sessions
export const tutorSessions = pgTable("tutor_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tutorId: varchar("tutor_id").notNull().references(() => liveTutors.id, { onDelete: "cascade" }),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration_minutes").notNull().default(60), // session length in minutes
  status: varchar("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  sessionType: varchar("session_type").notNull().default("conversation"), // conversation, pronunciation, lesson_review
  notes: text("notes"), // special requests or notes
  meetingRoomId: varchar("meeting_room_id"), // for video chat integration
  totalCost: integer("total_cost"), // in cents
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, refunded
  studentFeedback: jsonb("student_feedback"), // { rating, comment }
  tutorFeedback: jsonb("tutor_feedback"), // { rating, comment }
  recordingUrl: varchar("recording_url"), // optional session recording
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  streaks: many(userStreaks),
  conversations: many(tutorConversations),
  tutorSessions: many(tutorSessions),
}));

export const liveTutorsRelations = relations(liveTutors, ({ many }) => ({
  sessions: many(tutorSessions),
}));

export const tutorSessionsRelations = relations(tutorSessions, ({ one }) => ({
  student: one(users, {
    fields: [tutorSessions.studentId],
    references: [users.id],
  }),
  tutor: one(liveTutors, {
    fields: [tutorSessions.tutorId],
    references: [liveTutors.id],
  }),
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
  id: true,
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
export const insertLiveTutorSchema = createInsertSchema(liveTutors);
export const insertTutorSessionSchema = createInsertSchema(tutorSessions);

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserStreak = typeof userStreaks.$inferSelect;
export type InsertUserStreak = z.infer<typeof insertUserStreakSchema>;
export type TutorConversation = typeof tutorConversations.$inferSelect;
export type InsertTutorConversation = z.infer<typeof insertTutorConversationSchema>;
export type LiveTutor = typeof liveTutors.$inferSelect;
export type InsertLiveTutor = z.infer<typeof insertLiveTutorSchema>;
export type TutorSession = typeof tutorSessions.$inferSelect;
export type InsertTutorSession = z.infer<typeof insertTutorSessionSchema>;
