import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { generateSuggestions } from "./suggestions";
import { loginSchema } from "@shared/schema";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid credentials format" });
      }

      const { userId, password } = result.data;
      const numericUserId = parseInt(userId, 10);
      
      if (isNaN(numericUserId) || numericUserId < 1 || numericUserId > 100) {
        return res.status(401).json({ error: "Invalid user ID" });
      }

      const user = await storage.getUser(numericUserId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid password" });
      }

      req.session.userId = user.id;
      
      return res.json({
        id: user.id,
        name: user.name,
        nationalId: user.nationalId,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      nationalId: user.nationalId,
    });
  });

  app.get("/api/suggestions/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (isNaN(numericUserId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const suggestions = await generateSuggestions(numericUserId);
      return res.json(suggestions);
    } catch (error) {
      console.error("Suggestions error:", error);
      return res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  app.get("/api/users/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (isNaN(numericUserId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await storage.getUser(numericUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      nationalId: user.nationalId,
    });
  });

  app.get("/api/services/passport/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const passport = await storage.getPassportByUserId(numericUserId);
    if (!passport) {
      return res.status(404).json({ error: "Passport not found" });
    }

    return res.json(passport);
  });

  app.get("/api/services/national-id/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const nationalId = await storage.getNationalIdByUserId(numericUserId);
    if (!nationalId) {
      return res.status(404).json({ error: "National ID not found" });
    }

    return res.json(nationalId);
  });

  app.get("/api/services/driving-license/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const license = await storage.getDrivingLicenseByUserId(numericUserId);
    if (!license) {
      return res.status(404).json({ error: "Driving license not found" });
    }

    return res.json(license);
  });

  app.get("/api/services/violations/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const violations = await storage.getViolationsByUserId(numericUserId);
    return res.json(violations);
  });

  app.get("/api/services/violations/:userId/:violationId", requireAuth, async (req, res) => {
    const { userId, violationId } = req.params;
    const numericUserId = parseInt(userId, 10);
    const numericViolationId = parseInt(violationId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const violation = await storage.getViolationById(numericViolationId);
    if (!violation || violation.userId !== numericUserId) {
      return res.status(404).json({ error: "Violation not found" });
    }

    return res.json(violation);
  });

  app.get("/api/services/appointments/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const appointments = await storage.getAppointmentsByUserId(numericUserId);
    return res.json(appointments);
  });

  app.get("/api/services/appointments/:userId/:appointmentId", requireAuth, async (req, res) => {
    const { userId, appointmentId } = req.params;
    const numericUserId = parseInt(userId, 10);
    const numericAppointmentId = parseInt(appointmentId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const appointment = await storage.getAppointmentById(numericAppointmentId);
    if (!appointment || appointment.userId !== numericUserId) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.json(appointment);
  });

  app.get("/api/services/delegations/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const delegations = await storage.getDelegationsByUserId(numericUserId);
    return res.json(delegations);
  });

  app.get("/api/services/delegations/:userId/:delegationId", requireAuth, async (req, res) => {
    const { userId, delegationId } = req.params;
    const numericUserId = parseInt(userId, 10);
    const numericDelegationId = parseInt(delegationId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const delegation = await storage.getDelegationById(numericDelegationId);
    if (!delegation || delegation.userId !== numericUserId) {
      return res.status(404).json({ error: "Delegation not found" });
    }

    return res.json(delegation);
  });

  app.get("/api/services/hajj/:userId", requireAuth, async (req, res) => {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    
    if (req.session.userId !== numericUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const hajjStatus = await storage.getHajjStatusByUserId(numericUserId);
    if (!hajjStatus) {
      return res.status(404).json({ error: "Hajj status not found" });
    }

    return res.json(hajjStatus);
  });

  return httpServer;
}
