import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateSuggestions, getUserById } from "./suggestions";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET /api/suggestions/:userId - Get personalized suggestions for a user
  app.get("/api/suggestions/:userId", (req, res) => {
    const { userId } = req.params;
    
    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: "User not found",
        message: `No user found with ID: ${userId}` 
      });
    }

    const suggestions = generateSuggestions(userId);
    return res.json(suggestions);
  });

  // GET /api/users/:userId - Get user profile data
  app.get("/api/users/:userId", (req, res) => {
    const { userId } = req.params;
    
    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: "User not found",
        message: `No user found with ID: ${userId}` 
      });
    }

    // Return only safe user data (no sensitive info)
    return res.json({
      id: user.id,
      name: user.name,
    });
  });

  return httpServer;
}
