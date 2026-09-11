import { cn } from "@/lib/utils";
import type { UserStatus } from "../../types/user";

const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Actif",
  pending: "Invitation en attente",
};

export function StatusIndicator({ status }: { status: UserStatus }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          status === "active" ? "bg-success" : "bg-accent-500"
        )}
        aria-hidden
      />
      <span className="text-[13px] font-medium text-ink-700">{STATUS_LABELS[status]}</span>
    </div>
  );
}
