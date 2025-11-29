import type { Suggestion } from "@shared/schema";

function formatDateToYYYYMMDD(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDocumentTypeFromService(documentType: string): string {
  const mapping: { [key: string]: string } = {
    passport: "Passport",
    national_id: "National ID",
    driving_license: "Driving License",
  };
  return mapping[documentType] || documentType;
}

function mapServiceToActionUrl(documentType: string, serviceId?: string): string {
  const mapping: { [key: string]: string } = {
    Passport: "/services/passport",
    "National ID": "/services/national-id",
    "Driving License": "/services/driving-license",
  };
  return mapping[documentType] || "/services/dashboard";
}

export async function generateSuggestions(userId: number): Promise<Suggestion[]> {
  const aiApiUrl = process.env.AI_SUGGESTIONS_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${aiApiUrl}/user-notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      console.error(`AI API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const aiNotifications = data.notifications || [];

    const suggestions: Suggestion[] = aiNotifications.map(
      (notification: {
        document_type: string;
        message: string;
        action_url: string;
      }) => ({
        id: `ai-${notification.document_type}-${Date.now()}`,
        title: `${notification.document_type} Expiring Soon`,
        description: notification.message,
        actionUrl: mapServiceToActionUrl(notification.document_type),
        type: "document",
        priority: "medium" as const,
      })
    );

    return suggestions;
  } catch (error) {
    console.error("Failed to fetch AI suggestions:", error);
    return [];
  }
}
