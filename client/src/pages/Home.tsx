import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SuggestionsCarousel from "@/components/SuggestionsCarousel";
import DashboardGrid from "@/components/DashboardGrid";
import MobileNav from "@/components/MobileNav";
import { CarouselSkeleton, ServiceGridSkeleton } from "@/components/LoadingSkeleton";
import { useToast } from "@/hooks/use-toast";
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

export default function Home() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();

  useEffect(() => {
    // todo: replace with real API call
    const loadSuggestions = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    };

    loadSuggestions();
  }, []);

  const handleSuggestionAction = (actionUrl: string) => {
    toast({
      title: "Action Triggered",
      description: `Navigating to ${actionUrl}`,
    });
  };

  const handleServiceClick = (serviceId: string) => {
    toast({
      title: "Service Selected",
      description: `Opening ${serviceId} service`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header onMenuClick={() => console.log("Menu opened")} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <section aria-label="Smart Suggestions">
          <h2
            className="text-lg font-semibold text-foreground mb-4"
            data-testid="text-suggestions-title"
          >
            Smart Suggestions
          </h2>
          {isLoading ? (
            <CarouselSkeleton />
          ) : (
            <SuggestionsCarousel
              suggestions={suggestions}
              autoSlideInterval={5000}
              onAction={handleSuggestionAction}
            />
          )}
        </section>

        <section aria-label="Dashboard">
          {isLoading ? (
            <ServiceGridSkeleton />
          ) : (
            <DashboardGrid onServiceClick={handleServiceClick} />
          )}
        </section>
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
