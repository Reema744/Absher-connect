import SuggestionsCarousel from "../SuggestionsCarousel";
import type { Suggestion } from "@shared/schema";

// todo: remove mock functionality
const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    title: "Passport Expiring Soon",
    description: "Your passport will expire in 20 days. Renew now to avoid travel disruptions.",
    actionUrl: "/passport-renewal",
    expiryDate: "20 days",
    type: "document",
    priority: "high",
  },
  {
    id: "2",
    title: "Violation Discount Ending",
    description: "A traffic violation discount expires in 48 hours. Pay now to save.",
    actionUrl: "/pay-violation",
    expiryDate: "48 hours",
    type: "violation",
    priority: "high",
  },
  {
    id: "3",
    title: "Appointment Tomorrow",
    description: "You have an Absher appointment scheduled for tomorrow at 10:00 AM.",
    actionUrl: "/appointments",
    expiryDate: "24 hours",
    type: "appointment",
    priority: "medium",
  },
  {
    id: "4",
    title: "Delegation Expiring",
    description: "Your delegation authority expires in 5 days. Renew to maintain access.",
    actionUrl: "/delegations",
    expiryDate: "5 days",
    type: "delegation",
    priority: "low",
  },
  {
    id: "5",
    title: "Hajj Registration Open",
    description: "You are eligible for Hajj. Registration period is now open.",
    actionUrl: "/hajj-registration",
    type: "hajj",
    priority: "medium",
  },
];

export default function SuggestionsCarouselExample() {
  return (
    <SuggestionsCarousel
      suggestions={mockSuggestions}
      autoSlideInterval={5000}
      onAction={(url) => console.log("Navigate to:", url)}
    />
  );
}
