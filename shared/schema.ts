import { pgTable, text, serial, integer, timestamp, pgEnum, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (existing, updated)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
  xUrl: text("x_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  evaluations: many(evaluations),
}));

// Actresses table (new)
export const actresses = pgTable("actresses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const actressesRelations = relations(actresses, ({ many }) => ({
  evaluations: many(evaluations),
}));

// Evaluations table (new)
export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  actressId: integer("actress_id").notNull().references(() => actresses.id),
  looksRating: decimal("looks_rating", { precision: 3, scale: 1 }).notNull(),
  sexyRating: decimal("sexy_rating", { precision: 3, scale: 1 }).notNull(),
  elegantRating: decimal("elegant_rating", { precision: 3, scale: 1 }).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  user: one(users, {
    fields: [evaluations.userId],
    references: [users.id],
  }),
  actress: one(actresses, {
    fields: [evaluations.actressId],
    references: [actresses.id],
  }),
}));

// Schema for user registration/login (existing)
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).omit({ 
  id: true,
  createdAt: true,
});

// Schema for creating/updating actresses (new)
export const insertActressSchema = createInsertSchema(actresses, {
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
});

// Schema for creating/updating evaluations (new)
export const insertEvaluationSchema = createInsertSchema(evaluations, {
  looksRating: z.number().min(0).max(10),
  sexyRating: z.number().min(0).max(10),
  elegantRating: z.number().min(0).max(10),
  comment: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertActress = z.infer<typeof insertActressSchema>;
export type Actress = typeof actresses.$inferSelect;

export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;
export type Evaluation = typeof evaluations.$inferSelect;