import type { Suggestion } from "@shared/schema";

function getApiBase(): string {
  const port = process.env.PORT || 5000;
  return `http://127.0.0.1:${port}`;
}

interface DocumentData {
  documentType: string;
  daysToExpiry: number;
  documentImportance: "HIGH" | "MEDIUM" | "LOW";
  hasLateRenewalBefore: boolean;
  serviceId?: number;
  actionUrl: string;
}

/**
 * AI Notification Model - ported from Python Random Forest classifier
 * This implements the same scoring logic used to train the model
 */
function shouldNotify(doc: DocumentData): boolean {
  let score = 0;

  // Very close to expiry
  if (doc.daysToExpiry <= 7) {
    score += 3;
  } else if (doc.daysToExpiry <= 30) {
    score += 2;
  } else if (doc.daysToExpiry <= 60) {
    score += 1;
  }

  // More important documents get higher weight
  if (doc.documentImportance === "HIGH") {
    score += 2;
  } else if (doc.documentImportance === "MEDIUM") {
    score += 1;
  }

  // If user has late renewals, be more aggressive
  if (doc.hasLateRenewalBefore) {
    score += 1;
  }

  // Threshold for notification (same as Python model)
  return score >= 3;
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

function determinePriority(daysToExpiry: number): "high" | "medium" | "low" {
  if (daysToExpiry <= 7) return "high";
  if (daysToExpiry <= 14) return "medium";
  return "low";
}

async function fetchFromApi(endpoint: string, userId: number) {
  try {
    const apiBase = getApiBase();
    const response = await fetch(`${apiBase}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.warn(`API error for ${endpoint}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function generateSuggestions(userId: number): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];

  // Collect all documents to analyze
  const documentsToCheck: DocumentData[] = [];

  // Fetch passport
  const passport = await fetchFromApi(`/api/internal/services/passport/${userId}`, userId);
  if (passport?.expiryDate) {
    const daysUntil = getDaysUntil(passport.expiryDate);
    if (daysUntil > 0) {
      documentsToCheck.push({
        documentType: "Passport",
        daysToExpiry: daysUntil,
        documentImportance: daysUntil <= 30 ? "HIGH" : "MEDIUM",
        hasLateRenewalBefore: daysUntil < 0,
        serviceId: passport.id,
        actionUrl: "/services/passport",
      });
    }
  }

  // Fetch national ID
  const nationalId = await fetchFromApi(`/api/internal/services/national-id/${userId}`, userId);
  if (nationalId?.expiryDate) {
    const daysUntil = getDaysUntil(nationalId.expiryDate);
    if (daysUntil > 0) {
      documentsToCheck.push({
        documentType: "National ID",
        daysToExpiry: daysUntil,
        documentImportance: "HIGH",
        hasLateRenewalBefore: daysUntil < 0,
        serviceId: nationalId.id,
        actionUrl: "/services/national-id",
      });
    }
  }

  // Fetch driving license
  const drivingLicense = await fetchFromApi(
    `/api/internal/services/driving-license/${userId}`,
    userId
  );
  if (drivingLicense?.expiryDate) {
    const daysUntil = getDaysUntil(drivingLicense.expiryDate);
    if (daysUntil > 0) {
      documentsToCheck.push({
        documentType: "Driving License",
        daysToExpiry: daysUntil,
        documentImportance: daysUntil <= 30 ? "HIGH" : "MEDIUM",
        hasLateRenewalBefore: daysUntil < 0,
        serviceId: drivingLicense.id,
        actionUrl: "/services/driving-license",
      });
    }
  }

  // Run AI model on each document
  for (const doc of documentsToCheck) {
    if (shouldNotify(doc)) {
      const priority = determinePriority(doc.daysToExpiry);
      suggestions.push({
        id: `ai-${doc.documentType.toLowerCase().replace(/\s+/g, "-")}-${doc.serviceId || Date.now()}`,
        title: `${doc.documentType} Expiring Soon`,
        description: `Your ${doc.documentType} will expire in ${doc.daysToExpiry} day${doc.daysToExpiry !== 1 ? "s" : ""}. Would you like to renew it now?`,
        actionUrl: doc.actionUrl,
        expiryDate: `${doc.daysToExpiry} day${doc.daysToExpiry !== 1 ? "s" : ""}`,
        type: "document",
        priority,
        serviceId: doc.serviceId,
      });
    }
  }

  // Fetch violations
  const violations = await fetchFromApi(`/api/internal/services/violations/${userId}`, userId);
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
  const appointments = await fetchFromApi(`/api/internal/services/appointments/${userId}`, userId);
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
  const delegations = await fetchFromApi(`/api/internal/services/delegations/${userId}`, userId);
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
  const hajjStatus = await fetchFromApi(`/api/internal/services/hajj/${userId}`, userId);
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

  // Sort by priority (high first)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}
