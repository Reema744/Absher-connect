import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/Header";
import UserProfileCard from "@/components/UserProfileCard";
import SuggestionsCarousel from "@/components/SuggestionsCarousel";
import DashboardGrid from "@/components/DashboardGrid";
import MobileNav from "@/components/MobileNav";
import { CarouselSkeleton, ServiceGridSkeleton } from "@/components/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Suggestion } from "@shared/schema";

const USER_ID = "123";

interface UserProfile {
  id: string;
  name: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();

  const { data: user, isLoading: isUserLoading } = useQuery<UserProfile>({
    queryKey: ["/api/users", USER_ID],
  });

  const { data: suggestions = [], isLoading: isSuggestionsLoading } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions", USER_ID],
  });

  const isLoading = isUserLoading || isSuggestionsLoading;

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

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section aria-label="User Profile">
          {isLoading ? (
            <div className="flex items-center gap-4 p-4 rounded-lg border border-card-border bg-card">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>
          ) : (
            <UserProfileCard name={user?.name || "User"} greeting="Welcome back" />
          )}
        </section>

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
