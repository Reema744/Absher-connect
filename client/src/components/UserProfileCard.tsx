import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface UserProfileCardProps {
  name: string;
  avatarUrl?: string;
  greeting?: string;
}

export default function UserProfileCard({ name, avatarUrl, greeting = "Welcome back" }: UserProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="p-4 flex items-center gap-4 bg-card border border-card-border"
      data-testid="card-user-profile"
    >
      <Avatar className="h-14 w-14 border-2 border-primary">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground" data-testid="text-greeting">
          {greeting}
        </span>
        <h2 className="text-lg font-semibold text-foreground" data-testid="text-user-name">
          {name}
        </h2>
      </div>
    </Card>
  );
}
