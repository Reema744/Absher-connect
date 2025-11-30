import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Suggestion } from "@shared/schema";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAction?: (actionUrl: string) => void;
}

export default function SuggestionCard({ suggestion, onAction }: SuggestionCardProps) {
  return (
    <Card
      className="flex-shrink-0 w-96 p-6 flex flex-col gap-4 bg-green-50 border-2 border-green-200"
      data-testid={`card-suggestion-${suggestion.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-teal-700 mb-1" data-testid={`text-suggestion-label-${suggestion.id}`}>
              Smart Suggestion from Absher Connect
            </p>
            <h3
              className="text-2xl font-bold text-gray-900 mb-2"
              data-testid={`text-suggestion-title-${suggestion.id}`}
            >
              {suggestion.title}
            </h3>
            <p
              className="text-base text-gray-700"
              data-testid={`text-suggestion-description-${suggestion.id}`}
            >
              {suggestion.description}
            </p>
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          data-testid={`button-close-suggestion-${suggestion.id}`}
          aria-label="Close suggestion"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <Button
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-full py-2"
        onClick={() => {
          console.log(`Action triggered: ${suggestion.actionUrl}`);
          onAction?.(suggestion.actionUrl);
        }}
        data-testid={`button-action-${suggestion.id}`}
      >
        View Details
      </Button>
    </Card>
  );
}
