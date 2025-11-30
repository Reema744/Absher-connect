import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  id: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  wide?: boolean;
}

export default function ServiceCard({ id, icon: Icon, label, onClick, wide }: ServiceCardProps) {
  return (
    <Card
      className={`flex flex-col items-center justify-center p-4 cursor-pointer hover-elevate active-elevate-2 border border-gray-200 bg-white ${
        wide ? "col-span-2 aspect-auto" : "aspect-square"
      }`}
      onClick={() => {
        console.log(`Service clicked: ${label}`);
        onClick?.();
      }}
      data-testid={`card-service-${id}`}
    >
      {wide ? (
        <div className="flex items-center gap-4 w-full">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900">{label}</h3>
            <p className="text-sm text-gray-600 mt-1">View details, renew documents, report accidents, and much more.</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <span
            className="text-sm font-medium text-center text-foreground"
            data-testid={`text-service-label-${id}`}
          >
            {label}
          </span>
        </>
      )}
    </Card>
  );
}
