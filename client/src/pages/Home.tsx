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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header onMenuClick={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section aria-label="User Profile">
          {!user ? (
            <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white">
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

        {(isSuggestionsLoading || suggestions.length > 0) && (
          <section aria-label="Smart Suggestions">
            <h2
              className="text-lg font-semibold text-gray-900 mb-4"
              data-testid="text-suggestions-title"
            >
              Smart Suggestions
            </h2>
            {isSuggestionsLoading ? (
              <CarouselSkeleton />
            ) : (
              <SuggestionsCarousel
                suggestions={suggestions}
                autoSlideInterval={5000}
                onAction={handleSuggestionAction}
              />
            )}
          </section>
        )}

        <section aria-label="My Digital Documents" className="bg-white rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Digital Documents</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Passport</span>
              <span className="text-xs text-gray-500">Expires in 45 days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">National ID</span>
              <span className="text-xs text-gray-500">Valid</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Driving License</span>
              <span className="text-xs text-gray-500">Expires in 120 days</span>
            </div>
          </div>
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
