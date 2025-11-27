import { CarouselSkeleton, ServiceGridSkeleton } from "../LoadingSkeleton";

export default function LoadingSkeletonExample() {
  return (
    <div className="space-y-8 p-4">
      <CarouselSkeleton />
      <ServiceGridSkeleton />
    </div>
  );
}
