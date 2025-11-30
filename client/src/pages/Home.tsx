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
            <UserProfileCard name={user.name} greeting="Welcome back" nationalId={user.nationalId} />
          )}
        </section>

        {(isSuggestionsLoading || suggestions.length > 0) && (
          <section aria-label="Smart Suggestions">
            {isSuggestionsLoading ? (
              <CarouselSkeleton />
            ) : (
              <SuggestionsCarousel
                suggestions={suggestions}
                autoSlideInterval={5000}
                onAction={handleSuggestionAction}
                userName={user?.name}
              />
            )}
          </section>
        )}

        <section aria-label="My Digital Documents" className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Digital Documents</h2>
            <button className="text-sm text-primary font-medium">See All</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-100 rounded-lg p-4 aspect-square flex items-center justify-center">
              <div className="text-green-700 opacity-30">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 aspect-square flex items-center justify-center">
              <div className="text-green-700 opacity-30">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
            <span className="text-lg">●</span>
            <span>Your most relevant documents. Tap See All to see the rest of your documents and your family members</span>
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
