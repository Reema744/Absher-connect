import { Menu, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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
          <h1 className="text-xl font-bold" data-testid="text-app-title">Absher Connect Demo</h1>
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
              {user && (
                <>
                  <div className="px-2 py-1.5 text-sm text-muted-foreground" data-testid="text-user-name">
                    {user.name}
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem data-testid="menu-item-profile">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-item-settings">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                data-testid="menu-item-logout"
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
