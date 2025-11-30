import {
  FileText,
  CreditCard,
  Calendar,
  Users,
  Car,
  Building2,
  Plane,
  Shield,
} from "lucide-react";
import ServiceCard from "./ServiceCard";

// todo: remove mock functionality
const services = [
  { id: "driving-license", icon: Car, label: "My Vehicles", wide: true },
  { id: "passport", icon: FileText, label: "Passport" },
  { id: "national-id", icon: CreditCard, label: "National ID" },
  { id: "appointments", icon: Calendar, label: "Appointments" },
  { id: "delegations", icon: Users, label: "Delegations" },
  { id: "civil-affairs", icon: Building2, label: "Civil Affairs" },
  { id: "travel", icon: Plane, label: "Travel" },
  { id: "security", icon: Shield, label: "Security" },
];

interface DashboardGridProps {
  onServiceClick?: (serviceId: string) => void;
}

export default function DashboardGrid({ onServiceClick }: DashboardGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground" data-testid="text-services-title">
        Quick Access
      </h2>
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        data-testid="grid-services"
      >
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            icon={service.icon}
            label={service.label}
            wide={(service as any).wide}
            onClick={() => onServiceClick?.(service.id)}
          />
        ))}
      </div>
    </div>
  );
}
