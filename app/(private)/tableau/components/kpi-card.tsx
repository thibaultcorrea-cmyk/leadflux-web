import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Kpi } from "../types/tableau";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;

  return (
    <Card className="gap-1.5 ring-border [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle className="font-sans text-[13px] font-medium text-ink-500">
          {kpi.label}
        </CardTitle>
        <CardAction>
          <Icon className="size-4 text-ink-300" aria-hidden />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <p className="font-display text-[44px] leading-none tracking-[0.02em] text-primary-700 tabular-nums">
          {kpi.value}
        </p>
        <p className="text-xs text-ink-500">{kpi.hint}</p>
      </CardContent>
    </Card>
  );
}
