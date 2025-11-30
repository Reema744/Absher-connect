import { X, ChevronRight, LogOut, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DemoPanel from "./DemoPanel";

interface SettingsPanelProps {
  onClose: () => void;
  onSmartSuggestionsChange?: (enabled: boolean) => void;
}

export default function SettingsPanel({ onClose, onSmartSuggestionsChange }: SettingsPanelProps) {
  const { user, logout } = useAuth();
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState(() => {
    const saved = localStorage.getItem("smartSuggestionsEnabled");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("smartSuggestionsEnabled", JSON.stringify(smartSuggestions));
    onSmartSuggestionsChange?.(smartSuggestions);
  }, [smartSuggestions, onSmartSuggestionsChange]);

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
      onClick={onClose}
      data-testid="settings-overlay"
    >
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg animate-in slide-in-from-bottom max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-testid="settings-panel"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close-settings"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* ACCOUNT DETAILS SECTION */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Account Details
            </p>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {/* User Profile */}
              <div className="flex items-center justify-between p-4 hover-elevate cursor-pointer">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.name?.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-600">
                      ID No. {user?.nationalId}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200" />

              {/* Absher Authenticator */}
              <div className="flex items-center justify-between p-4 hover-elevate cursor-pointer">
                <p className="font-semibold text-gray-900">Absher Authenticator</p>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* PRIVACY AND SECURITY SECTION */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Privacy and Security
            </p>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {/* Trusted Devices */}
              <div className="flex items-center justify-between p-4">
                <p className="font-semibold text-gray-900">Trusted Devices</p>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-px bg-gray-200" />

              {/* Parental Consent */}
              <div className="flex items-center justify-between p-4">
                <p className="font-semibold text-gray-900">Parental Consent</p>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-px bg-gray-200" />

              {/* Use Passcode */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Use Passcode</p>
                  <Switch disabled checked={true} data-testid="toggle-passcode" />
                </div>
                <p className="text-xs text-gray-600">
                  Passcode is required to access your Digital Documents and Absher
                  Authenticator while logged out, and allows you to stay logged in for
                  longer.
                </p>
              </div>
              <div className="h-px bg-gray-200" />

              {/* Smart Suggestions from Absher Connect */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">
                    Smart Suggestions from Absher Connect
                  </p>
                  <Switch
                    checked={smartSuggestions}
                    onCheckedChange={setSmartSuggestions}
                    data-testid="toggle-smart-suggestions"
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Receive automated service recommendations based on your profile and
                  activity.
                </p>
              </div>
              <div className="h-px bg-gray-200" />

              {/* Blur images */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Blur images</p>
                  <Switch disabled checked={true} data-testid="toggle-blur-images" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Demo Button */}
          <Button
            variant="secondary"
            className="w-full mb-2"
            onClick={() => setShowDemoPanel(true)}
            data-testid="button-ai-demo"
          >
            <Brain className="h-5 w-5 mr-2" />
            AI Engine Demo
          </Button>

          {/* Logout Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              logout();
              onClose();
            }}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>

          {/* Footer spacing */}
          <div className="pb-4" />
        </div>
      </div>

      {/* Demo Panel */}
      {showDemoPanel && <DemoPanel onClose={() => setShowDemoPanel(false)} />}
    </div>
  );
}
