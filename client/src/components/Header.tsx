import { Menu, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SettingsPanel from "./SettingsPanel";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-600"
                onClick={onMenuClick}
                data-testid="button-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-app-title">Absher</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-600"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-gray-600"
                onClick={handleSettingsClick}
                data-testid="button-settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}
