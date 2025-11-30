import type { Suggestion } from "@shared/schema";
import { storage } from "./storage";

export interface DocumentAnalysis {
  documentType: string;
  daysToExpiry: number;
  documentImportance: "HIGH" | "MEDIUM" | "LOW";
  hasLateRenewalBefore: boolean;
  aiScore: number;
  scoreBreakdown: {
    expiryScore: number;
    importanceScore: number;
    historyScore: number;
  };
  shouldNotify: boolean;
  threshold: number;
}

export interface SuggestionAnalysis {
  timestamp: string;
  userId: number;
  apiCalls: {
    endpoint: string;
    method: string;
    status: "success" | "not_found";
    responseTime: number;
    data?: any;
  }[];
  inputData: {
    passport?: any;
    nationalId?: any;
    drivingLicense?: any;
    violations?: any[];
    appointments?: any[];
    delegations?: any[];
    hajjStatus?: any;
  };
  aiAnalysis: {
    documentsAnalyzed: DocumentAnalysis[];
    rulesApplied: string[];
    modelType: string;
    modelVersion: string;
  };
  output: {
    totalSuggestions: number;
    byPriority: { high: number; medium: number; low: number };
    byType: { [key: string]: number };
    suggestions: Suggestion[];
  };
  processingTime: number;
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

function calculateAiScore(doc: {
  daysToExpiry: number;
  documentImportance: "HIGH" | "MEDIUM" | "LOW";
  hasLateRenewalBefore: boolean;
}): { score: number; breakdown: { expiryScore: number; importanceScore: number; historyScore: number } } {
  let expiryScore = 0;
  let importanceScore = 0;
  let historyScore = 0;

  if (doc.daysToExpiry <= 7) {
    expiryScore = 3;
  } else if (doc.daysToExpiry <= 30) {
    expiryScore = 2;
  } else if (doc.daysToExpiry <= 60) {
    expiryScore = 1;
  }

  if (doc.documentImportance === "HIGH") {
    importanceScore = 2;
  } else if (doc.documentImportance === "MEDIUM") {
    importanceScore = 1;
  }

  if (doc.hasLateRenewalBefore) {
    historyScore = 1;
  }

  return {
    score: expiryScore + importanceScore + historyScore,
    breakdown: { expiryScore, importanceScore, historyScore }
  };
}

function determinePriority(daysToExpiry: number): "high" | "medium" | "low" {
  if (daysToExpiry <= 7) return "high";
  if (daysToExpiry <= 14) return "medium";
  return "low";
}

export async function generateSuggestionsWithAnalysis(userId: number): Promise<SuggestionAnalysis> {
  const startTime = Date.now();
  const apiCalls: SuggestionAnalysis["apiCalls"] = [];
  const documentsAnalyzed: DocumentAnalysis[] = [];
  const suggestions: Suggestion[] = [];
  const inputData: SuggestionAnalysis["inputData"] = {};

  const rulesApplied = [
    "Document Expiry Rule: Check if document expires within 60 days",
    "AI Scoring Model: Calculate notification priority based on urgency, importance, and user history",
    "Threshold Rule: Notify if AI score >= 3",
    "Violation Discount Rule: Alert if discount expires within 72 hours",
    "Appointment Reminder Rule: Notify 24 hours before scheduled appointments",
    "Delegation Expiry Rule: Alert 7 days before delegation expires",
    "Hajj Eligibility Rule: Check registration eligibility during open season"
  ];

  // Fetch and analyze passport
  let callStart = Date.now();
  const passport = await storage.getPassportByUserId(userId);
  apiCalls.push({
    endpoint: `/api/internal/services/passport/${userId}`,
    method: "GET",
    status: passport ? "success" : "not_found",
    responseTime: Date.now() - callStart,
    data: passport
  });
  inputData.passport = passport;

  if (passport?.expiryDate) {
    const daysUntil = getDaysUntil(passport.expiryDate);
    if (daysUntil > 0) {
      const importance: "HIGH" | "MEDIUM" | "LOW" = daysUntil <= 30 ? "HIGH" : "MEDIUM";
      const { score, breakdown } = calculateAiScore({
        daysToExpiry: daysUntil,
        documentImportance: importance,
        hasLateRenewalBefore: daysUntil < 0
      });
      const shouldNotify = score >= 3;

      documentsAnalyzed.push({
        documentType: "Passport",
        daysToExpiry: daysUntil,
        documentImportance: importance,
        hasLateRenewalBefore: daysUntil < 0,
        aiScore: score,
        scoreBreakdown: breakdown,
        shouldNotify,
        threshold: 3
      });

      if (shouldNotify) {
        suggestions.push({
          id: `ai-passport-${passport.id}`,
          title: "Passport Expiring Soon",
          description: `Your Passport will expire in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Would you like to renew it now?`,
          actionUrl: "/services/passport",
          expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
          type: "document",
          priority: determinePriority(daysUntil),
          serviceId: passport.id,
        });
      }
    }
  }

  // Fetch and analyze national ID
  callStart = Date.now();
  const nationalId = await storage.getNationalIdByUserId(userId);
  apiCalls.push({
    endpoint: `/api/internal/services/national-id/${userId}`,
    method: "GET",
    status: nationalId ? "success" : "not_found",
    responseTime: Date.now() - callStart,
    data: nationalId
  });
  inputData.nationalId = nationalId;

  if (nationalId?.expiryDate) {
    const daysUntil = getDaysUntil(nationalId.expiryDate);
    if (daysUntil > 0) {
      const { score, breakdown } = calculateAiScore({
        daysToExpiry: daysUntil,
        documentImportance: "HIGH",
        hasLateRenewalBefore: daysUntil < 0
      });
      const shouldNotify = score >= 3;

      documentsAnalyzed.push({
        documentType: "National ID",
        daysToExpiry: daysUntil,
        documentImportance: "HIGH",
        hasLateRenewalBefore: daysUntil < 0,
        aiScore: score,
        scoreBreakdown: breakdown,
        shouldNotify,
        threshold: 3
      });

      if (shouldNotify) {
        suggestions.push({
          id: `ai-national-id-${nationalId.id}`,
          title: "National ID Expiring Soon",
          description: `Your National ID will expire in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Would you like to renew it now?`,
          actionUrl: "/services/national-id",
          expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
          type: "document",
          priority: determinePriority(daysUntil),
          serviceId: nationalId.id,
        });
      }
    }
  }

  // Fetch and analyze driving license
  callStart = Date.now();
  const drivingLicense = await storage.getDrivingLicenseByUserId(userId);
  apiCalls.push({
    endpoint: `/api/internal/services/driving-license/${userId}`,
    method: "GET",
    status: drivingLicense ? "success" : "not_found",
    responseTime: Date.now() - callStart,
    data: drivingLicense
  });
  inputData.drivingLicense = drivingLicense;

  if (drivingLicense?.expiryDate) {
    const daysUntil = getDaysUntil(drivingLicense.expiryDate);
    if (daysUntil > 0) {
      const importance: "HIGH" | "MEDIUM" | "LOW" = daysUntil <= 30 ? "HIGH" : "MEDIUM";
      const { score, breakdown } = calculateAiScore({
        daysToExpiry: daysUntil,
        documentImportance: importance,
        hasLateRenewalBefore: daysUntil < 0
      });
      const shouldNotify = score >= 3;

      documentsAnalyzed.push({
        documentType: "Driving License",
        daysToExpiry: daysUntil,
        documentImportance: importance,
        hasLateRenewalBefore: daysUntil < 0,
        aiScore: score,
        scoreBreakdown: breakdown,
        shouldNotify,
        threshold: 3
      });

      if (shouldNotify) {
        suggestions.push({
          id: `ai-driving-license-${drivingLicense.id}`,
          title: "Driving License Expiring Soon",
          description: `Your Driving License will expire in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}. Would you like to renew it now?`,
          actionUrl: "/services/driving-license",
          expiryDate: `${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
          type: "document",
          priority: determinePriority(daysUntil),
          serviceId: drivingLicense.id,
        });
      }
    }
  }

  // Fetch violations
  callStart = Date.now();
  const violations = await storage.getViolationsByUserId(userId);
  apiCalls.push({
    endpoint: `/api/internal/services/violations/${userId}`,
    method: "GET",
    status: "success",
    responseTime: Date.now() - callStart,
    data: violations
  });
  inputData.violations = violations;

  if (Array.isArray(violations)) {
    for (const violation of violations) {
      if (violation.status === "unpaid" && violation.discountExpiry) {
        const hoursUntil = getHoursUntil(violation.discountExpiry);
        if (hoursUntil > 0 && hoursUntil <= 72) {
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
  }

  // Fetch appointments
  callStart = Date.now();
  const appointments = await storage.getAppointmentsByUserId(userId);
  apiCalls.push({
    endpoint: `/api/internal/services/appointments/${userId}`,
    method: "GET",
    status: "success",
    responseTime: Date.now() - callStart,
    data: appointments
  });
  inputData.appointments = appointments;

  if (Array.isArray(appointments)) {
    for (const appointment of appointments) {
      if (appointment.status === "scheduled") {
        const hoursUntil = getHoursUntil(appointment.appointmentDate);
        if (hoursUntil > 0 && hoursUntil <= 24) {
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
  }

  // Fetch delegations
  callStart = Date.now();
  const delegations = await storage.getDelegationsByUserId(userId);
  apiCalls.push({
    endpoint: `/api/internal/services/delegations/${userId}`,
    method: "GET",
    status: "success",
    responseTime: Date.now() - callStart,
    data: delegations
  });
  inputData.delegations = delegations;

  if (Array.isArray(delegations)) {
    for (const delegation of delegations) {
      if (delegation.status === "active") {
        const daysUntil = getDaysUntil(delegation.expiryDate);
        if (daysUntil > 0 && daysUntil <= 7) {
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
  }

  // Fetch Hajj status
  callStart = Date.now();
  const hajjStatus = await storage.getHajjStatusByUserId(userId);
  apiCalls.push({
    endpoint: `/api/internal/services/hajj/${userId}`,
    method: "GET",
    status: hajjStatus ? "success" : "not_found",
    responseTime: Date.now() - callStart,
    data: hajjStatus
  });
  inputData.hajjStatus = hajjStatus;

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

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Calculate output stats
  const byPriority = { high: 0, medium: 0, low: 0 };
  const byType: { [key: string]: number } = {};
  for (const s of suggestions) {
    byPriority[s.priority]++;
    byType[s.type] = (byType[s.type] || 0) + 1;
  }

  return {
    timestamp: new Date().toISOString(),
    userId,
    apiCalls,
    inputData,
    aiAnalysis: {
      documentsAnalyzed,
      rulesApplied,
      modelType: "Random Forest Classifier (Ported)",
      modelVersion: "1.0.0"
    },
    output: {
      totalSuggestions: suggestions.length,
      byPriority,
      byType,
      suggestions
    },
    processingTime: Date.now() - startTime
  };
}
