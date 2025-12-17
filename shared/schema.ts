import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Media Analysis schema for storing search results
export const mediaAnalyses = pgTable("media_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  mediaType: text("media_type").notNull(), // movie, show, book, song
  tmdbId: integer("tmdb_id"), // TMDB ID for precise cache matching
  imdbRating: text("imdb_rating"),
  genre: text("genre"),
  description: text("description"),
  posterUrl: text("poster_url"),
  trailerUrl: text("trailer_url"),
  discernmentScore: integer("discernment_score").notNull(),
  faithAnalysis: text("faith_analysis").notNull(),
  tags: text("tags").array(),
  verseText: text("verse_text").notNull(),
  verseReference: text("verse_reference").notNull(),
  alternatives: text("alternatives").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMediaAnalysisSchema = createInsertSchema(mediaAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertMediaAnalysis = z.infer<typeof insertMediaAnalysisSchema>;
export type MediaAnalysis = typeof mediaAnalyses.$inferSelect;

// Alternative media recommendation type
export type Alternative = {
  title: string;
  reason: string;
  thumbnailUrl?: string;
};

// Verse reflection type
export type VerseReflection = {
  text: string;
  reference: string;
};

// Search request schema
export const searchRequestSchema = z.object({
  title: z.string().min(1, "Please enter a media title"),
  mediaType: z.enum(["movie", "show", "book", "song"]).optional(),
  tmdbId: z.number().optional(),
  posterUrl: z.string().optional(),
  releaseYear: z.string().optional(),
  overview: z.string().optional(),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;

// TMDB result type
export type TMDBResult = {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseYear: string | null;
  overview: string;
  rating: number;
  voteCount?: number;
  popularity?: number;
  mediaType: "movie" | "show" | "book" | "song";
};

// API response types
export type SearchResponse = {
  id: string;
  title: string;
  mediaType: string;
  imdbRating?: string;
  genre?: string;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  discernmentScore: number;
  faithAnalysis: string;
  tags: string[];
  verse: VerseReflection;
  alternatives: Alternative[];
};

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Saved Analyses table (user bookmarks)
export const savedAnalyses = pgTable("saved_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  analysisId: varchar("analysis_id").notNull().references(() => mediaAnalyses.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").defaultNow(),
}, (table) => [
  index("idx_user_saved").on(table.userId),
  index("idx_analysis_saved").on(table.analysisId),
]);

export const insertSavedAnalysisSchema = createInsertSchema(savedAnalyses).omit({
  id: true,
  savedAt: true,
});

export type InsertSavedAnalysis = z.infer<typeof insertSavedAnalysisSchema>;
export type SavedAnalysis = typeof savedAnalyses.$inferSelect;

// Community Features (Scaffolded for Future Development)

// Comments on media analyses
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  analysisId: varchar("analysis_id").notNull().references(() => mediaAnalyses.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_comments_analysis").on(table.analysisId),
  index("idx_comments_user").on(table.userId),
]);

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// User reviews/ratings
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  analysisId: varchar("analysis_id").notNull().references(() => mediaAnalyses.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_reviews_analysis").on(table.analysisId),
  index("idx_reviews_user").on(table.userId),
]);

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Discussion topics/threads
export const discussions = pgTable("discussions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"), // general, prayer, recommendations, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_discussions_user").on(table.userId),
  index("idx_discussions_category").on(table.category),
]);

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Discussion = typeof discussions.$inferSelect;

// Discussion replies
export const discussionReplies = pgTable("discussion_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discussionId: varchar("discussion_id").notNull().references(() => discussions.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_replies_discussion").on(table.discussionId),
  index("idx_replies_user").on(table.userId),
]);

export const insertDiscussionReplySchema = createInsertSchema(discussionReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDiscussionReply = z.infer<typeof insertDiscussionReplySchema>;
export type DiscussionReply = typeof discussionReplies.$inferSelect;
