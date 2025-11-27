import { FileText, AlertTriangle, Calendar, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Suggestion } from "@shared/schema";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAction?: (actionUrl: string) => void;
}

const iconMap = {
  document: FileText,
  violation: AlertTriangle,
  appointment: Calendar,
  delegation: Users,
  hajj: Star,
};

const priorityColors = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-amber-500 text-white dark:bg-amber-600",
  low: "bg-primary text-primary-foreground",
};

export default function SuggestionCard({ suggestion, onAction }: SuggestionCardProps) {
  const Icon = iconMap[suggestion.type];

  return (
    <Card
      className="flex-shrink-0 w-80 h-44 p-5 flex flex-col justify-between bg-card border border-card-border"
      data-testid={`card-suggestion-${suggestion.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold text-foreground line-clamp-1"
              data-testid={`text-suggestion-title-${suggestion.id}`}
            >
              {suggestion.title}
            </h3>
          </div>
        </div>
        {suggestion.expiryDate && (
          <Badge
            variant="secondary"
            className={`text-xs whitespace-nowrap ${priorityColors[suggestion.priority]}`}
            data-testid={`badge-expiry-${suggestion.id}`}
          >
            {suggestion.expiryDate}
          </Badge>
        )}
      </div>

      <p
        className="text-sm text-muted-foreground line-clamp-2 mt-2"
        data-testid={`text-suggestion-description-${suggestion.id}`}
      >
        {suggestion.description}
      </p>

      <Button
        className="w-full mt-3"
        onClick={() => {
          console.log(`Action triggered: ${suggestion.actionUrl}`);
          onAction?.(suggestion.actionUrl);
        }}
        data-testid={`button-action-${suggestion.id}`}
      >
        Take Action
      </Button>
    </Card>
  );
}
