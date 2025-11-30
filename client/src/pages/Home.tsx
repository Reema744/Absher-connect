import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Info, Brain } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import UserProfileCard from "@/components/UserProfileCard";
import SuggestionsCarousel from "@/components/SuggestionsCarousel";
import DashboardGrid from "@/components/DashboardGrid";
import MobileNav from "@/components/MobileNav";
import DemoPanel from "@/components/DemoPanel";
import { CarouselSkeleton, ServiceGridSkeleton } from "@/components/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import moiLogo from "@assets/ministry-of-interior-logo-png_seeklogo-455595_1764525526112.png";
import type { Suggestion } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const [smartSuggestionsEnabled, setSmartSuggestionsEnabled] = useState(() => {
    const saved = localStorage.getItem("smartSuggestionsEnabled");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Listen for storage changes (when settings are updated)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("smartSuggestionsEnabled");
      setSmartSuggestionsEnabled(saved !== null ? JSON.parse(saved) : true);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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

  const handleSmartSuggestionsChange = (enabled: boolean) => {
    setSmartSuggestionsEnabled(enabled);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header onMenuClick={() => {}} onSmartSuggestionsChange={handleSmartSuggestionsChange} />
      
      {/* Demo Mode Toggle Button */}
      <Button
        onClick={() => setShowDemoPanel(true)}
        className="fixed bottom-24 right-4 z-40 rounded-full shadow-lg bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90"
        size="lg"
        data-testid="button-demo-mode"
      >
        <Brain className="h-5 w-5 mr-2" />
        AI Demo
      </Button>

      {/* Demo Panel */}
      {showDemoPanel && <DemoPanel onClose={() => setShowDemoPanel(false)} />}
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

        {smartSuggestionsEnabled && (isSuggestionsLoading || suggestions.length > 0) && (
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

        <section aria-label="My Digital Documents" className="p-4 mt-[6px] mb-[6px] pt-[0px] pb-[0px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Digital Documents</h2>
            <button className="text-sm text-primary font-medium">See All</button>
          </div>
          <div className="flex gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {["Citizen ID", "Passport", "Driver License"].map((docName) => (
              <div
                key={docName}
                className="bg-gradient-to-l from-green-200 to-green-50 rounded-lg p-4 flex-shrink-0 w-1/2 aspect-video flex flex-col justify-between relative overflow-hidden"
                data-testid={`card-document-${docName}`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900" data-testid={`text-document-name-${docName}`}>
                    {docName}
                  </p>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-30">
                  <img src={moiLogo} alt="MOI" className="h-24 w-24" data-testid={`img-moi-logo-${docName}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" data-testid="icon-info" />
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
