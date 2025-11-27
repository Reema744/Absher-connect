import { useState } from "react";
import MobileNav from "../MobileNav";

export default function MobileNavExample() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="relative h-20">
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
