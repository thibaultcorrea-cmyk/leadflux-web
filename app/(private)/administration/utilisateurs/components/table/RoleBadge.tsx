import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "../../types/user";

const ROLE_LABELS: Record<UserRole, string> = { admin: "Admin", client: "Client" };

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge
      className={cn(
        "h-auto gap-0 rounded-full px-2.5 py-[3px] text-[11px] font-semibold",
        role === "admin" ? "bg-primary-50 text-primary-700" : "bg-background-200 text-ink-700"
      )}
    >
      {ROLE_LABELS[role]}
    </Badge>
  );
}
