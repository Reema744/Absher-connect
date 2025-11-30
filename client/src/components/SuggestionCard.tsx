import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Suggestion } from "@shared/schema";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAction?: (actionUrl: string) => void;
  userName?: string;
}

export default function SuggestionCard({ suggestion, onAction, userName }: SuggestionCardProps) {
  const firstName = userName?.split(" ")[0] || "User";
  return (
    <Card
      className="flex-shrink-0 w-96 p-3 flex flex-col gap-2 bg-green-50 border-2 border-green-200"
      data-testid={`card-suggestion-${suggestion.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-teal-700" data-testid={`text-suggestion-label-${suggestion.id}`}>
              Smart Suggestion from Absher Connect
            </p>
            <h3
              className="text-lg font-bold text-gray-900"
              data-testid={`text-suggestion-title-${suggestion.id}`}
            >
              Welcome, {firstName}
            </h3>
            <p
              className="text-sm text-gray-700"
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
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-end">
        <Button
          className="w-1/3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full py-1 text-sm"
          onClick={() => {
            console.log(`Action triggered: ${suggestion.actionUrl}`);
            onAction?.(suggestion.actionUrl);
          }}
          data-testid={`button-action-${suggestion.id}`}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
