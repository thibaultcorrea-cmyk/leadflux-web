import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserAccount } from "../../types/user";

export function UserCell({ user }: { user: UserAccount }) {
  const isPending = user.status === "pending";

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback
          className={cn(
            "text-xs font-semibold",
            isPending ? "bg-background-200 text-ink-500" : "bg-primary-400 text-background"
          )}
        >
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
          {user.isCurrentUser && (
            <Badge className="h-auto shrink-0 gap-0 rounded-full bg-background-200 px-[7px] py-px text-[10px] font-semibold text-ink-700">
              vous
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-ink-500">{user.email}</p>
      </div>
    </div>
  );
}
