import { Button } from "@/components/ui/button";
import { useState } from "react";
import SettingsPanel from "./SettingsPanel";
import absherLogo from "@assets/Absher.svg_1764525255245.png";
import moiLogo from "@assets/ministry-of-interior-logo-png_seeklogo-455595_1764525526112.png";
import settingsIcon from "@assets/Setting_line_light_1764534055148.png";
import bellIcon from "@assets/Bell_duotone_line_1764534055147.png";

interface HeaderProps {
  onMenuClick?: () => void;
  onSmartSuggestionsChange?: (enabled: boolean) => void;
}

export default function Header({ onMenuClick, onSmartSuggestionsChange }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="px-4 py-0 max-w-6xl mx-auto pt-[12px] pb-[12px]">
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

            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 p-2"
                onClick={handleSettingsClick}
                data-testid="button-settings"
              >
                <img src={settingsIcon} alt="Settings" className="h-8 w-8" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 p-2"
                data-testid="button-notifications"
              >
                <img src={bellIcon} alt="Notifications" className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onSmartSuggestionsChange={onSmartSuggestionsChange}
        />
      )}
    </>
  );
}
