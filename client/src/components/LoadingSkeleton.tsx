import { Skeleton } from "@/components/ui/skeleton";

export function SuggestionCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-80 h-44 p-5 rounded-lg border border-card-border bg-card">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mt-4" />
      <Skeleton className="h-3 w-4/5 mt-2" />
      <Skeleton className="h-9 w-full mt-4" />
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="space-y-4" data-testid="skeleton-carousel">
      <div className="flex gap-4 overflow-hidden">
        <SuggestionCardSkeleton />
        <SuggestionCardSkeleton />
        <SuggestionCardSkeleton />
      </div>
      <div className="flex justify-center gap-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
      </div>
    </div>
  );
}

export function ServiceGridSkeleton() {
  return (
    <div className="space-y-4" data-testid="skeleton-services">
      <Skeleton className="h-6 w-24" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}
