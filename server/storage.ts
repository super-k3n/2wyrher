import { users, actresses, evaluations, type User, type InsertUser, type Actress, type InsertActress, type Evaluation, type InsertEvaluation } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Actress methods
  getActresses(): Promise<Actress[]>;
  getActress(id: number): Promise<Actress | undefined>;
  createActress(actress: InsertActress): Promise<Actress>;

  // Evaluation methods
  getEvaluations(actressId: number): Promise<(Evaluation & { user: User })[]>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
  getAverageRatings(actressId: number): Promise<{
    avgLooks: number;
    avgSexy: number;
    avgElegant: number;
  }>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Actress methods
  async getActresses(): Promise<Actress[]> {
    return await db.select().from(actresses).orderBy(actresses.name);
  }

  async getActress(id: number): Promise<Actress | undefined> {
    const [actress] = await db.select().from(actresses).where(eq(actresses.id, id));
    return actress;
  }

  async createActress(insertActress: InsertActress): Promise<Actress> {
    const [actress] = await db.insert(actresses).values(insertActress).returning();
    return actress;
  }

  // Evaluation methods
  async getEvaluations(actressId: number): Promise<(Evaluation & { user: User })[]> {
    return await db
      .select({
        ...evaluations,
        user: users,
      })
      .from(evaluations)
      .where(eq(evaluations.actressId, actressId))
      .leftJoin(users, eq(evaluations.userId, users.id))
      .orderBy(evaluations.createdAt);
  }

  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const [evaluation] = await db.insert(evaluations).values(insertEvaluation).returning();
    return evaluation;
  }

  async getUserEvaluations(userId: number): Promise<(Evaluation & { user: User })[]> {
    return await db
      .select({
        ...evaluations,
        user: users,
      })
      .from(evaluations)
      .where(eq(evaluations.userId, userId))
      .leftJoin(users, eq(evaluations.userId, users.id))
      .orderBy(evaluations.createdAt);
  }

  async getUserTopActresses(userId: number): Promise<(Actress & { rating: number })[]> {
    const userEvaluations = await db
      .select({
        actressId: evaluations.actressId,
        avgRating: sql<number>`(${evaluations.looksRating} + ${evaluations.sexyRating} + ${evaluations.elegantRating}) / 3.0 as avg_rating`,
      })
      .from(evaluations)
      .where(eq(evaluations.userId, userId))
      .orderBy(sql`avg_rating DESC`)
      .limit(5);

    const topActresses = await Promise.all(
      userEvaluations.map(async (evaluation) => {
        const actress = await this.getActress(evaluation.actressId);
        return { ...actress!, rating: Number(evaluation.avgRating) };
      })
    );

    return topActresses;
  }

  async getAverageRatings(actressId: number): Promise<{
    avgLooks: number;
    avgSexy: number;
    avgElegant: number;
  }> {
    const [result] = await db
      .select({
        avgLooks: sql<number>`round(avg(${evaluations.looksRating}), 1)`,
        avgSexy: sql<number>`round(avg(${evaluations.sexyRating}), 1)`,
        avgElegant: sql<number>`round(avg(${evaluations.elegantRating}), 1)`,
      })
      .from(evaluations)
      .where(eq(evaluations.actressId, actressId));

    return {
      avgLooks: Number(result?.avgLooks) || 0,
      avgSexy: Number(result?.avgSexy) || 0,
      avgElegant: Number(result?.avgElegant) || 0,
    };
  }
}

export const storage = new DatabaseStorage();