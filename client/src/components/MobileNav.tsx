import { Home, FileText, MoreHorizontal } from "lucide-react";

interface MobileNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "services", icon: FileText, label: "My Services" },
  { id: "other", icon: MoreHorizontal, label: "Other Services" },
];

export default function MobileNav({ activeTab = "home", onTabChange }: MobileNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-card-border md:hidden"
      data-testid="nav-mobile"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                console.log(`Tab changed: ${item.id}`);
                onTabChange?.(item.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              data-testid={`button-nav-${item.id}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
