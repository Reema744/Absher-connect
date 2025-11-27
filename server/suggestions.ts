import { readFileSync } from "fs";
import { join } from "path";
import type { Suggestion } from "@shared/schema";

interface Violation {
  id: string;
  discountExpiry: string;
}

interface Appointment {
  id: string;
  date: string;
}

interface Delegation {
  id: string;
  expires: string;
}

interface UserData {
  id: string;
  name: string;
  passportExpiry: string;
  nationalIdExpiry: string;
  drivingLicenseExpiry: string;
  violations: Violation[];
  appointments: Appointment[];
  delegations: Delegation[];
  hajjEligible: boolean;
}

interface Config {
  expiryThresholdDays: number;
  appointmentReminderHours: number;
  violationDiscountThresholdHours: number;
  delegationExpiryDays: number;
}

function loadUsers(): Record<string, UserData> {
  const filePath = join(process.cwd(), "data", "users.json");
  const data = readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function loadConfig(): Config {
  const filePath = join(process.cwd(), "data", "config.json");
  const data = readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function getDaysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getHoursUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

function checkDocumentExpiry(
  documentName: string,
  expiryDate: string,
  thresholdDays: number,
  actionUrl: string
): Suggestion | null {
  const daysUntil = getDaysUntil(expiryDate);
  
  if (daysUntil > 0 && daysUntil <= thresholdDays) {
    const priority = daysUntil <= 7 ? "high" : daysUntil <= 14 ? "medium" : "low";
    return {
      id: `doc-${documentName.toLowerCase().replace(/\s+/g, "-")}`,
      title: `${documentName} Expiring Soon`,
      description: `Your ${documentName.toLowerCase()} will expire in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Renew now to avoid service disruptions.`,
      actionUrl,
      expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
      type: "document",
      priority,
    };
  }
  return null;
}

function checkViolationDiscount(
  violation: Violation,
  thresholdHours: number
): Suggestion | null {
  const hoursUntil = getHoursUntil(violation.discountExpiry);
  
  if (hoursUntil > 0 && hoursUntil <= thresholdHours) {
    return {
      id: `violation-${violation.id}`,
      title: "Violation Discount Ending",
      description: `A traffic violation discount expires in ${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}. Pay now to save.`,
      actionUrl: "/pay-violation",
      expiryDate: `${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}`,
      type: "violation",
      priority: "high",
    };
  }
  return null;
}

function checkAppointmentReminder(
  appointment: Appointment,
  reminderHours: number
): Suggestion | null {
  const hoursUntil = getHoursUntil(appointment.date);
  
  if (hoursUntil > 0 && hoursUntil <= reminderHours) {
    const appointmentDate = new Date(appointment.date);
    const timeString = appointmentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    
    return {
      id: `appointment-${appointment.id}`,
      title: "Appointment Coming Up",
      description: `You have an Absher appointment in ${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""} at ${timeString}.`,
      actionUrl: "/appointments",
      expiryDate: `${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}`,
      type: "appointment",
      priority: "medium",
    };
  }
  return null;
}

function checkDelegationExpiry(
  delegation: Delegation,
  thresholdDays: number
): Suggestion | null {
  const daysUntil = getDaysUntil(delegation.expires);
  
  if (daysUntil > 0 && daysUntil <= thresholdDays) {
    const priority = daysUntil <= 3 ? "high" : "medium";
    return {
      id: `delegation-${delegation.id}`,
      title: "Delegation Expiring",
      description: `Your delegation authority expires in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Renew to maintain access.`,
      actionUrl: "/delegations",
      expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
      type: "delegation",
      priority,
    };
  }
  return null;
}

function checkHajjEligibility(isEligible: boolean): Suggestion | null {
  if (!isEligible) return null;

  // Hajj period is typically in July/August
  // Show suggestion 6 months before (around January/February)
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed
  
  // Show Hajj suggestion from December through June (6 months before typical Hajj)
  if (currentMonth >= 11 || currentMonth <= 5) {
    return {
      id: "hajj-eligibility",
      title: "Hajj Registration Open",
      description: "You are eligible for Hajj. Registration period is now open. Apply early to secure your spot.",
      actionUrl: "/hajj-registration",
      type: "hajj",
      priority: "medium",
    };
  }
  return null;
}

export function generateSuggestions(userId: string): Suggestion[] {
  const users = loadUsers();
  const config = loadConfig();
  
  const user = users[userId];
  if (!user) {
    return [];
  }

  const suggestions: Suggestion[] = [];

  // Rule 1: Check document expiries (Passport, National ID, Driving License)
  const passportSuggestion = checkDocumentExpiry(
    "Passport",
    user.passportExpiry,
    config.expiryThresholdDays,
    "/passport-renewal"
  );
  if (passportSuggestion) suggestions.push(passportSuggestion);

  const nationalIdSuggestion = checkDocumentExpiry(
    "National ID",
    user.nationalIdExpiry,
    config.expiryThresholdDays,
    "/national-id-renewal"
  );
  if (nationalIdSuggestion) suggestions.push(nationalIdSuggestion);

  const drivingLicenseSuggestion = checkDocumentExpiry(
    "Driving License",
    user.drivingLicenseExpiry,
    config.expiryThresholdDays,
    "/driving-license-renewal"
  );
  if (drivingLicenseSuggestion) suggestions.push(drivingLicenseSuggestion);

  // Rule 2: Check violation discounts
  for (const violation of user.violations) {
    const violationSuggestion = checkViolationDiscount(
      violation,
      config.violationDiscountThresholdHours
    );
    if (violationSuggestion) suggestions.push(violationSuggestion);
  }

  // Rule 3: Check appointments
  for (const appointment of user.appointments) {
    const appointmentSuggestion = checkAppointmentReminder(
      appointment,
      config.appointmentReminderHours
    );
    if (appointmentSuggestion) suggestions.push(appointmentSuggestion);
  }

  // Rule 4: Check delegations
  for (const delegation of user.delegations) {
    const delegationSuggestion = checkDelegationExpiry(
      delegation,
      config.delegationExpiryDays
    );
    if (delegationSuggestion) suggestions.push(delegationSuggestion);
  }

  // Rule 5: Check Hajj eligibility
  const hajjSuggestion = checkHajjEligibility(user.hajjEligible);
  if (hajjSuggestion) suggestions.push(hajjSuggestion);

  // Sort by priority: high first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}

export function getUserById(userId: string): UserData | null {
  const users = loadUsers();
  return users[userId] || null;
}
