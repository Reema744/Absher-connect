import { X, Bell, Lock, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
      onClick={onClose}
      data-testid="settings-overlay"
    >
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
        data-testid="settings-panel"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
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

        <div className="px-6 py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600">Receive service updates</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5"
              data-testid="checkbox-notifications"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Privacy & Security</p>
                <p className="text-sm text-gray-600">Manage your account security</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" data-testid="button-manage-security">
              Manage Settings
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Language</p>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              data-testid="select-language"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-3">
            <Button
              onClick={onClose}
              className="w-full"
              data-testid="button-save-settings"
            >
              Done
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
