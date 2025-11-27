import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-primary text-primary-foreground border-b border-primary-border">
      <div className="flex items-center justify-between h-full px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary-foreground"
            onClick={onMenuClick}
            data-testid="button-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold" data-testid="text-app-title">
            Absher (Dummy App)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary-foreground"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-primary-foreground"
                data-testid="button-user-menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid="menu-item-profile">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-item-settings">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-item-logout">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
