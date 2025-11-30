import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface UserProfileCardProps {
  name: string;
  avatarUrl?: string;
  greeting?: string;
  nationalId?: string;
}

export default function UserProfileCard({ name, avatarUrl, greeting = "Welcome back", nationalId }: UserProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="p-4 flex items-center gap-4 bg-white border border-gray-200"
      data-testid="card-user-profile"
    >
      <Avatar className="h-14 w-14 border-2 border-primary">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1">
        <h2 className="text-base font-bold text-gray-900" data-testid="text-user-name">
          {name}
        </h2>
        {nationalId && (
          <span className="text-xs text-gray-600" data-testid="text-national-id">
            ID No. {nationalId}
          </span>
        )}
      </div>
      <div className="text-gray-400">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Card>
  );
}
