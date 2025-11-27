import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export default function ServiceCard({ id, icon: Icon, label, onClick }: ServiceCardProps) {
  return (
    <Card
      className="flex flex-col items-center justify-center p-4 aspect-square cursor-pointer hover-elevate active-elevate-2 border border-card-border"
      onClick={() => {
        console.log(`Service clicked: ${label}`);
        onClick?.();
      }}
      data-testid={`card-service-${id}`}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span
        className="text-sm font-medium text-center text-foreground"
        data-testid={`text-service-label-${id}`}
      >
        {label}
      </span>
    </Card>
  );
}
