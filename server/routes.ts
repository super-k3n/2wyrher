import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertActressSchema, insertEvaluationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Get all actresses
  app.get("/api/actresses", async (_req, res) => {
    const actresses = await storage.getActresses();
    
    // Get evaluations and average ratings for each actress
    const actressesWithData = await Promise.all(
      actresses.map(async (actress) => {
        const evaluations = await storage.getEvaluations(actress.id);
        const averageRatings = await storage.getAverageRatings(actress.id);
        return {
          ...actress,
          evaluations,
          averageRatings,
        };
      })
    );
    
    res.json(actressesWithData);
  });

  // Get a specific actress with evaluations
  app.get("/api/actresses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const actress = await storage.getActress(id);
    if (!actress) {
      return res.status(404).json({ message: "Actress not found" });
    }

    const evaluations = await storage.getEvaluations(id);
    const averageRatings = await storage.getAverageRatings(id);

    res.json({
      ...actress,
      evaluations,
      averageRatings,
    });
  });

  // Create a new actress (protected)
  app.post("/api/actresses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parseResult = insertActressSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: parseResult.error.message });
    }

    const actress = await storage.createActress(parseResult.data);
    res.status(201).json(actress);
  });

  // Create a new evaluation (protected)
  app.post("/api/actresses/:id/evaluate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const actressId = parseInt(req.params.id);
    const actress = await storage.getActress(actressId);
    if (!actress) {
      return res.status(404).json({ message: "Actress not found" });
    }

    const parseResult = insertEvaluationSchema.safeParse({
      ...req.body,
      userId: req.user!.id,
      actressId,
    });

    if (!parseResult.success) {
      return res.status(400).json({ message: parseResult.error.message });
    }

    const evaluation = await storage.createEvaluation(parseResult.data);
    res.status(201).json(evaluation);
  });

  const httpServer = createServer(app);
  return httpServer;
}