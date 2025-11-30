import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SettingsPanel from "./SettingsPanel";
import absherLogo from "@assets/Absher.svg_1764525255245.png";
import moiLogo from "@assets/ministry-of-interior-logo-png_seeklogo-455595_1764525526112.png";

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
        <div className="px-4 py-3 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={absherLogo}
                alt="Absher"
                className="h-10 w-auto"
                data-testid="img-absher-logo"
              />
              <img
                src={moiLogo}
                alt="Ministry of Interior"
                className="h-10 w-auto"
                data-testid="img-moi-logo"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-600"
                onClick={handleSettingsClick}
                data-testid="button-settings"
              >
                <Settings className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-gray-600"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}
