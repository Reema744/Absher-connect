import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SuggestionCard from "./SuggestionCard";
import type { Suggestion } from "@shared/schema";

interface SuggestionsCarouselProps {
  suggestions: Suggestion[];
  autoSlideInterval?: number;
  onAction?: (actionUrl: string) => void;
}

export default function SuggestionsCarousel({
  suggestions,
  autoSlideInterval = 5000,
  onAction,
}: SuggestionsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 320 + 16;

  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const newIndex = ((index % suggestions.length) + suggestions.length) % suggestions.length;
      setCurrentIndex(newIndex);
      scrollContainerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [suggestions.length, cardWidth]);

  const handlePrev = () => {
    scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  useEffect(() => {
    if (isPaused || suggestions.length <= 1) return;

    const interval = setInterval(() => {
      scrollToIndex(currentIndex + 1);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, suggestions.length, autoSlideInterval, scrollToIndex]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < suggestions.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-44 bg-muted rounded-lg">
        <p className="text-muted-foreground" data-testid="text-no-suggestions">
          No suggestions available
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      data-testid="carousel-suggestions"
    >
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={handlePrev}
          className="hidden md:flex flex-shrink-0"
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 scroll-smooth"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="snap-start">
              <SuggestionCard suggestion={suggestion} onAction={onAction} />
            </div>
          ))}
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={handleNext}
          className="hidden md:flex flex-shrink-0"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4" data-testid="carousel-indicators">
        {suggestions.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-primary"
                : "bg-muted-foreground/30"
            }`}
            aria-label={`Go to suggestion ${index + 1}`}
            data-testid={`button-indicator-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
