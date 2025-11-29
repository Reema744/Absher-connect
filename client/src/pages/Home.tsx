import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import UserProfileCard from "@/components/UserProfileCard";
import SuggestionsCarousel from "@/components/SuggestionsCarousel";
import DashboardGrid from "@/components/DashboardGrid";
import MobileNav from "@/components/MobileNav";
import { CarouselSkeleton, ServiceGridSkeleton } from "@/components/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import type { Suggestion } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: suggestions = [], isLoading: isSuggestionsLoading } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions", user?.id],
    enabled: !!user,
  });

  const handleSuggestionAction = (actionUrl: string) => {
    setLocation(actionUrl);
  };

  const handleServiceClick = (serviceId: string) => {
    setLocation(`/services/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header onMenuClick={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section aria-label="User Profile">
          {!user ? (
            <div className="flex items-center gap-4 p-4 rounded-lg border border-card-border bg-card">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>
          ) : (
            <UserProfileCard name={user.name} greeting="Welcome back" />
          )}
        </section>

        <section aria-label="Smart Suggestions">
          <h2
            className="text-lg font-semibold text-foreground mb-4"
            data-testid="text-suggestions-title"
          >
            Smart Suggestions
          </h2>
          {isSuggestionsLoading ? (
            <CarouselSkeleton />
          ) : suggestions.length > 0 ? (
            <SuggestionsCarousel
              suggestions={suggestions}
              autoSlideInterval={5000}
              onAction={handleSuggestionAction}
            />
          ) : (
            <div className="p-6 text-center text-muted-foreground bg-card rounded-lg border" data-testid="text-no-suggestions">
              No suggestions at this time. All your documents and services are up to date!
            </div>
          )}
        </section>

        <section aria-label="Dashboard">
          {!user ? (
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
