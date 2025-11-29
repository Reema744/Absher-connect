import { storage } from "./storage";
import type { Suggestion } from "@shared/schema";
import { readFileSync } from "fs";
import { join } from "path";

interface Config {
  expiryThresholdDays: number;
  appointmentReminderHours: number;
  violationDiscountThresholdHours: number;
  delegationExpiryDays: number;
}

function loadConfig(): Config {
  const filePath = join(process.cwd(), "data", "config.json");
  const data = readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function getDaysUntil(dateString: string | Date): number {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getHoursUntil(dateString: string | Date): number {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

export async function generateSuggestions(userId: number): Promise<Suggestion[]> {
  const config = loadConfig();
  const suggestions: Suggestion[] = [];

  const passport = await storage.getPassportByUserId(userId);
  if (passport) {
    const daysUntil = getDaysUntil(passport.expiryDate);
    if (daysUntil > 0 && daysUntil <= config.expiryThresholdDays) {
      const priority = daysUntil <= 7 ? "high" : daysUntil <= 14 ? "medium" : "low";
      suggestions.push({
        id: `passport-${passport.id}`,
        title: "Passport Expiring Soon",
        description: `Your passport will expire in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Renew now to avoid service disruptions.`,
        actionUrl: `/services/passport`,
        expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
        type: "document",
        priority,
        serviceId: passport.id,
      });
    }
  }

  const nationalId = await storage.getNationalIdByUserId(userId);
  if (nationalId) {
    const daysUntil = getDaysUntil(nationalId.expiryDate);
    if (daysUntil > 0 && daysUntil <= config.expiryThresholdDays) {
      const priority = daysUntil <= 7 ? "high" : daysUntil <= 14 ? "medium" : "low";
      suggestions.push({
        id: `national-id-${nationalId.id}`,
        title: "National ID Expiring Soon",
        description: `Your national ID will expire in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Renew now to avoid service disruptions.`,
        actionUrl: `/services/national-id`,
        expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
        type: "document",
        priority,
        serviceId: nationalId.id,
      });
    }
  }

  const drivingLicense = await storage.getDrivingLicenseByUserId(userId);
  if (drivingLicense) {
    const daysUntil = getDaysUntil(drivingLicense.expiryDate);
    if (daysUntil > 0 && daysUntil <= config.expiryThresholdDays) {
      const priority = daysUntil <= 7 ? "high" : daysUntil <= 14 ? "medium" : "low";
      suggestions.push({
        id: `driving-license-${drivingLicense.id}`,
        title: "Driving License Expiring Soon",
        description: `Your driving license will expire in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Renew now to avoid service disruptions.`,
        actionUrl: `/services/driving-license`,
        expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
        type: "document",
        priority,
        serviceId: drivingLicense.id,
      });
    }
  }

  const violations = await storage.getViolationsByUserId(userId);
  for (const violation of violations) {
    if (violation.status === "unpaid" && violation.discountExpiry) {
      const hoursUntil = getHoursUntil(violation.discountExpiry);
      if (hoursUntil > 0 && hoursUntil <= config.violationDiscountThresholdHours) {
        suggestions.push({
          id: `violation-${violation.id}`,
          title: "Violation Discount Ending",
          description: `A traffic violation discount expires in ${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}. Pay now to save.`,
          actionUrl: `/services/violation/${violation.id}`,
          expiryDate: `${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}`,
          type: "violation",
          priority: "high",
          serviceId: violation.id,
        });
      }
    }
  }

  const appointments = await storage.getAppointmentsByUserId(userId);
  for (const appointment of appointments) {
    if (appointment.status === "scheduled") {
      const hoursUntil = getHoursUntil(appointment.appointmentDate);
      if (hoursUntil > 0 && hoursUntil <= config.appointmentReminderHours) {
        const appointmentDate = new Date(appointment.appointmentDate);
        const timeString = appointmentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        suggestions.push({
          id: `appointment-${appointment.id}`,
          title: "Appointment Coming Up",
          description: `You have an Absher appointment in ${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""} at ${timeString}.`,
          actionUrl: `/services/appointment/${appointment.id}`,
          expiryDate: `${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}`,
          type: "appointment",
          priority: "medium",
          serviceId: appointment.id,
        });
      }
    }
  }

  const delegations = await storage.getDelegationsByUserId(userId);
  for (const delegation of delegations) {
    if (delegation.status === "active") {
      const daysUntil = getDaysUntil(delegation.expiryDate);
      if (daysUntil > 0 && daysUntil <= config.delegationExpiryDays) {
        const priority = daysUntil <= 3 ? "high" : "medium";
        suggestions.push({
          id: `delegation-${delegation.id}`,
          title: "Delegation Expiring",
          description: `Your delegation authority expires in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Renew to maintain access.`,
          actionUrl: `/services/delegation/${delegation.id}`,
          expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
          type: "delegation",
          priority,
          serviceId: delegation.id,
        });
      }
    }
  }

  const hajjStatus = await storage.getHajjStatusByUserId(userId);
  if (hajjStatus && hajjStatus.eligible && hajjStatus.registrationStatus !== "registered") {
    const now = new Date();
    const currentMonth = now.getMonth();
    if (currentMonth >= 11 || currentMonth <= 5) {
      suggestions.push({
        id: `hajj-${hajjStatus.id}`,
        title: "Hajj Registration Open",
        description: "You are eligible for Hajj. Registration period is now open. Apply early to secure your spot.",
        actionUrl: `/services/hajj`,
        type: "hajj",
        priority: "medium",
        serviceId: hajjStatus.id,
      });
    }
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}
