import SuggestionCard from "../SuggestionCard";
import type { Suggestion } from "@shared/schema";

const mockSuggestion: Suggestion = {
  id: "1",
  title: "Passport Expiring Soon",
  description: "Your passport will expire in 20 days. Renew now to avoid travel disruptions.",
  actionUrl: "/passport-renewal",
  expiryDate: "20 days",
  type: "document",
  priority: "high",
};

export default function SuggestionCardExample() {
  return (
    <SuggestionCard
      suggestion={mockSuggestion}
      onAction={(url) => console.log("Navigate to:", url)}
    />
  );
}
