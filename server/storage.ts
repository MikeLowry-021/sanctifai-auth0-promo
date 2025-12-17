import {
  type MediaAnalysis,
  type InsertMediaAnalysis,
  type SearchResponse,
  type Alternative,
  type User,
  type UpsertUser,
  type SavedAnalysis,
  type InsertSavedAnalysis,
  type Comment,
  type InsertComment,
  type Review,
  type InsertReview,
  type Discussion,
  type InsertDiscussion,
  type DiscussionReply,
  type InsertDiscussionReply,
  mediaAnalyses,
  users,
  savedAnalyses,
  comments,
  reviews,
  discussions,
  discussionReplies,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { config } from "./config";

export interface IStorage {
  // Media analysis operations
  getAnalysis(id: string): Promise<MediaAnalysis | undefined>;
  getAnalysisByTitle(title: string): Promise<MediaAnalysis | undefined>;
  getAnalysisByTmdbId(tmdbId: number, mediaType: string): Promise<MediaAnalysis | undefined>;
  createAnalysis(analysis: InsertMediaAnalysis): Promise<MediaAnalysis>;
  updateAnalysis(id: string, analysis: InsertMediaAnalysis): Promise<MediaAnalysis>;
  getAllAnalyses(): Promise<MediaAnalysis[]>;
  logSearch?(searchData: {
    title: string;
    mediaType: string;
    discernmentScore: number;
    timestamp: Date;
  }): Promise<void>;
  
  // User operations (FUTURE WORK - POST HACKATHON: for authentication system)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Saved analyses operations (user bookmarks)
  getSavedAnalyses(userId: string): Promise<MediaAnalysis[]>;
  saveAnalysis(userId: string, analysisId: string): Promise<SavedAnalysis>;
  unsaveAnalysis(userId: string, analysisId: string): Promise<void>;
  isAnalysisSaved(userId: string, analysisId: string): Promise<boolean>;
  
  // Community operations (scaffolded for future development)
  // Comments
  getCommentsByAnalysis(analysisId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(commentId: string, userId: string): Promise<void>;
  
  // Reviews
  getReviewsByAnalysis(analysisId: string): Promise<Review[]>;
  getUserReview(analysisId: string, userId: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(reviewId: string, userId: string, content: string, rating: number): Promise<Review>;
  deleteReview(reviewId: string, userId: string): Promise<void>;
  
  // Discussions
  getAllDiscussions(category?: string): Promise<Discussion[]>;
  getDiscussion(discussionId: string): Promise<Discussion | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  deleteDiscussion(discussionId: string, userId: string): Promise<void>;
  
  // Discussion replies
  getRepliesByDiscussion(discussionId: string): Promise<DiscussionReply[]>;
  createReply(reply: InsertDiscussionReply): Promise<DiscussionReply>;
  deleteReply(replyId: string, userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, MediaAnalysis>;
  private users: Map<string, User>;
  private savedAnalyses: Map<string, SavedAnalysis>;

  constructor() {
    this.analyses = new Map();
    this.users = new Map();
    this.savedAnalyses = new Map();
  }

  async getAnalysis(id: string): Promise<MediaAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getAnalysisByTitle(title: string): Promise<MediaAnalysis | undefined> {
    return Array.from(this.analyses.values()).find(
      (analysis) => analysis.title.toLowerCase() === title.toLowerCase()
    );
  }

  async getAnalysisByTmdbId(tmdbId: number, mediaType: string): Promise<MediaAnalysis | undefined> {
    return Array.from(this.analyses.values()).find(
      (analysis) => analysis.tmdbId === tmdbId && analysis.mediaType === mediaType
    );
  }

  async createAnalysis(
    insertAnalysis: InsertMediaAnalysis
  ): Promise<MediaAnalysis> {
    const id = randomUUID();
    const createdAt = new Date();
    const analysis: MediaAnalysis = {
      ...insertAnalysis,
      id,
      createdAt,
      tmdbId: insertAnalysis.tmdbId ?? null,
      imdbRating: insertAnalysis.imdbRating ?? null,
      genre: insertAnalysis.genre ?? null,
      description: insertAnalysis.description ?? null,
      posterUrl: insertAnalysis.posterUrl ?? null,
      trailerUrl: insertAnalysis.trailerUrl ?? null,
      tags: insertAnalysis.tags ?? []
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async updateAnalysis(
    id: string,
    insertAnalysis: InsertMediaAnalysis
  ): Promise<MediaAnalysis> {
    const existing = this.analyses.get(id);
    if (!existing) {
      throw new Error("Analysis not found");
    }
    const analysis: MediaAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: existing.createdAt,
      tmdbId: insertAnalysis.tmdbId ?? null,
      imdbRating: insertAnalysis.imdbRating ?? null,
      genre: insertAnalysis.genre ?? null,
      description: insertAnalysis.description ?? null,
      posterUrl: insertAnalysis.posterUrl ?? null,
      trailerUrl: insertAnalysis.trailerUrl ?? null,
      tags: insertAnalysis.tags ?? []
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAllAnalyses(): Promise<MediaAnalysis[]> {
    return Array.from(this.analyses.values());
  }

  // User operations (FUTURE WORK - POST HACKATHON: for authentication system)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      id: userData.id || randomUUID(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  // Saved analyses operations
  async getSavedAnalyses(userId: string): Promise<MediaAnalysis[]> {
    const savedItems = Array.from(this.savedAnalyses.values()).filter(
      (saved) => saved.userId === userId
    );
    const analyses: MediaAnalysis[] = [];
    for (const saved of savedItems) {
      const analysis = this.analyses.get(saved.analysisId);
      if (analysis) {
        analyses.push(analysis);
      }
    }
    return analyses;
  }

  async saveAnalysis(userId: string, analysisId: string): Promise<SavedAnalysis> {
    // Check if already saved to prevent duplicates
    const existing = Array.from(this.savedAnalyses.values()).find(
      (saved) => saved.userId === userId && saved.analysisId === analysisId
    );
    
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const savedAt = new Date();
    const saved: SavedAnalysis = {
      id,
      userId,
      analysisId,
      savedAt,
    };
    this.savedAnalyses.set(id, saved);
    return saved;
  }

  async unsaveAnalysis(userId: string, analysisId: string): Promise<void> {
    const saved = Array.from(this.savedAnalyses.entries()).find(
      ([_, s]) => s.userId === userId && s.analysisId === analysisId
    );
    if (saved) {
      this.savedAnalyses.delete(saved[0]);
    }
  }

  async isAnalysisSaved(userId: string, analysisId: string): Promise<boolean> {
    return Array.from(this.savedAnalyses.values()).some(
      (saved) => saved.userId === userId && saved.analysisId === analysisId
    );
  }

  // FUTURE WORK - POST HACKATHON: Community operations (scaffolded - not yet implemented)
  async getCommentsByAnalysis(analysisId: string): Promise<Comment[]> {
    throw new Error("Community features not yet implemented");
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    throw new Error("Community features not yet implemented");
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }

  async getReviewsByAnalysis(analysisId: string): Promise<Review[]> {
    throw new Error("Community features not yet implemented");
  }

  async getUserReview(analysisId: string, userId: string): Promise<Review | undefined> {
    throw new Error("Community features not yet implemented");
  }

  async createReview(review: InsertReview): Promise<Review> {
    throw new Error("Community features not yet implemented");
  }

  async updateReview(reviewId: string, userId: string, content: string, rating: number): Promise<Review> {
    throw new Error("Community features not yet implemented");
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }

  async getAllDiscussions(category?: string): Promise<Discussion[]> {
    throw new Error("Community features not yet implemented");
  }

  async getDiscussion(discussionId: string): Promise<Discussion | undefined> {
    throw new Error("Community features not yet implemented");
  }

  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    throw new Error("Community features not yet implemented");
  }

  async deleteDiscussion(discussionId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }

  async getRepliesByDiscussion(discussionId: string): Promise<DiscussionReply[]> {
    throw new Error("Community features not yet implemented");
  }

  async createReply(reply: InsertDiscussionReply): Promise<DiscussionReply> {
    throw new Error("Community features not yet implemented");
  }

  async deleteReply(replyId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }
}

export class DbStorage implements IStorage {
  // Media analysis operations
  async getAnalysis(id: string): Promise<MediaAnalysis | undefined> {
    const result = await db.select().from(mediaAnalyses).where(eq(mediaAnalyses.id, id));
    return result[0];
  }

  async getAnalysisByTitle(title: string): Promise<MediaAnalysis | undefined> {
    const result = await db
      .select()
      .from(mediaAnalyses)
      .where(eq(mediaAnalyses.title, title));
    return result[0];
  }

  async getAnalysisByTmdbId(tmdbId: number, mediaType: string): Promise<MediaAnalysis | undefined> {
    const result = await db
      .select()
      .from(mediaAnalyses)
      .where(and(eq(mediaAnalyses.tmdbId, tmdbId), eq(mediaAnalyses.mediaType, mediaType)));
    return result[0];
  }

  async createAnalysis(insertAnalysis: InsertMediaAnalysis): Promise<MediaAnalysis> {
    const result = await db.insert(mediaAnalyses).values(insertAnalysis).returning();
    return result[0];
  }

  async updateAnalysis(id: string, insertAnalysis: InsertMediaAnalysis): Promise<MediaAnalysis> {
    const result = await db
      .update(mediaAnalyses)
      .set(insertAnalysis)
      .where(eq(mediaAnalyses.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error("Analysis not found");
    }

    return result[0];
  }

  async getAllAnalyses(): Promise<MediaAnalysis[]> {
    return await db.select().from(mediaAnalyses).orderBy(desc(mediaAnalyses.createdAt));
  }

  // User operations (FUTURE WORK - POST HACKATHON: for authentication system)
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const result = await db
      .insert(users)
      .values({
        ...userData,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: now,
        },
      })
      .returning();
    return result[0];
  }

  // Saved analyses operations
  async getSavedAnalyses(userId: string): Promise<MediaAnalysis[]> {
    const saved = await db
      .select({
        analysis: mediaAnalyses,
      })
      .from(savedAnalyses)
      .innerJoin(mediaAnalyses, eq(savedAnalyses.analysisId, mediaAnalyses.id))
      .where(eq(savedAnalyses.userId, userId))
      .orderBy(desc(savedAnalyses.savedAt));
    
    return saved.map((s) => s.analysis);
  }

  async saveAnalysis(userId: string, analysisId: string): Promise<SavedAnalysis> {
    // Check if already saved
    const existing = await db
      .select()
      .from(savedAnalyses)
      .where(and(eq(savedAnalyses.userId, userId), eq(savedAnalyses.analysisId, analysisId)));
    
    if (existing.length > 0) {
      return existing[0];
    }

    const result = await db
      .insert(savedAnalyses)
      .values({ userId, analysisId })
      .returning();
    return result[0];
  }

  async unsaveAnalysis(userId: string, analysisId: string): Promise<void> {
    await db
      .delete(savedAnalyses)
      .where(and(eq(savedAnalyses.userId, userId), eq(savedAnalyses.analysisId, analysisId)));
  }

  async isAnalysisSaved(userId: string, analysisId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(savedAnalyses)
      .where(and(eq(savedAnalyses.userId, userId), eq(savedAnalyses.analysisId, analysisId)));
    return result.length > 0;
  }

  // FUTURE WORK - POST HACKATHON: Community operations (scaffolded - not yet implemented)
  async getCommentsByAnalysis(analysisId: string): Promise<Comment[]> {
    throw new Error("Community features not yet implemented");
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    throw new Error("Community features not yet implemented");
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }

  async getReviewsByAnalysis(analysisId: string): Promise<Review[]> {
    throw new Error("Community features not yet implemented");
  }

  async getUserReview(analysisId: string, userId: string): Promise<Review | undefined> {
    throw new Error("Community features not yet implemented");
  }

  async createReview(review: InsertReview): Promise<Review> {
    throw new Error("Community features not yet implemented");
  }

  async updateReview(reviewId: string, userId: string, content: string, rating: number): Promise<Review> {
    throw new Error("Community features not yet implemented");
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }

  async getAllDiscussions(category?: string): Promise<Discussion[]> {
    throw new Error("Community features not yet implemented");
  }

  async getDiscussion(discussionId: string): Promise<Discussion | undefined> {
    throw new Error("Community features not yet implemented");
  }

  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    throw new Error("Community features not yet implemented");
  }

  async deleteDiscussion(discussionId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }

  async getRepliesByDiscussion(discussionId: string): Promise<DiscussionReply[]> {
    throw new Error("Community features not yet implemented");
  }

  async createReply(reply: InsertDiscussionReply): Promise<DiscussionReply> {
    throw new Error("Community features not yet implemented");
  }

  async deleteReply(replyId: string, userId: string): Promise<void> {
    throw new Error("Community features not yet implemented");
  }
}

// Use PostgreSQL database for persistent storage, or in-memory if DATABASE_URL not set
async function createStorage(): Promise<IStorage> {
  if (!config.databaseUrl) {
    console.log("⚠️  DATABASE_URL not set - using in-memory storage");
    return new MemStorage();
  }

  try {
    // Test database connection
    await db.select().from(mediaAnalyses).limit(1);
    console.log("✅ Using PostgreSQL database for persistent storage");
    return new DbStorage();
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL:", error);
    console.log("⚠️  Falling back to in-memory storage");
    return new MemStorage();
  }
}

// Export a promise that resolves to the storage instance
export const storagePromise = createStorage();

// For backwards compatibility, export a synchronous getter that returns MemStorage temporarily
// This will be replaced once the async init completes
let _storage: IStorage = new MemStorage();
storagePromise.then(s => { _storage = s; });

export const storage = new Proxy({} as IStorage, {
  get(_, prop) {
    return (_storage as any)[prop];
  }
});

// Helper to convert MediaAnalysis to SearchResponse
export function toSearchResponse(analysis: MediaAnalysis): SearchResponse {
  const alternatives: Alternative[] = JSON.parse(analysis.alternatives);
  return {
    id: analysis.id,
    title: analysis.title,
    mediaType: analysis.mediaType,
    imdbRating: analysis.imdbRating || undefined,
    genre: analysis.genre || undefined,
    description: analysis.description || undefined,
    posterUrl: analysis.posterUrl || undefined,
    trailerUrl: analysis.trailerUrl || undefined,
    discernmentScore: analysis.discernmentScore,
    faithAnalysis: analysis.faithAnalysis,
    tags: analysis.tags || [],
    verse: {
      text: analysis.verseText,
      reference: analysis.verseReference,
    },
    alternatives,
  };
}
