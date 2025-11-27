import { FileText } from "lucide-react";
import ServiceCard from "../ServiceCard";

export default function ServiceCardExample() {
  return (
    <div className="w-32">
      <ServiceCard
        id="passport"
        icon={FileText}
        label="Passport"
        onClick={() => console.log("Passport clicked")}
      />
    </div>
  );
}
