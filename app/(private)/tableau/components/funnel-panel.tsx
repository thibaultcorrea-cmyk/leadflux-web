import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { funnelSteps } from "../mocks/funnel";
import type { FunnelStep } from "../types/tableau";

const TONE_CLASSES: Record<FunnelStep["tone"], string> = {
  neutral: "[&_[data-slot=progress-indicator]]:bg-primary-400",
  accent: "[&_[data-slot=progress-indicator]]:bg-accent-500",
  success: "[&_[data-slot=progress-indicator]]:bg-success",
};

export function FunnelPanel() {
  // Le premier palier sert de référence : chaque étape se lit en proportion
  // des prospects sourcés, pas de l'étape précédente.
  const reference = Math.max(...funnelSteps.map((step) => step.value), 1);

  return (
    <Card className="gap-4 ring-border [--card-spacing:--spacing(5)]">
      <CardHeader>
        <h2 className="text-[15px] font-semibold text-ink-900">
          Entonnoir de prospection
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        {funnelSteps.map((step) => (
          <Progress
            key={step.id}
            value={Math.round((step.value / reference) * 100)}
            aria-label={`${step.label} : ${step.value}`}
            className={cn(
              "flex-col gap-1.5",
              "[&_[data-slot=progress-track]]:h-2.5 [&_[data-slot=progress-track]]:bg-background-200",
              TONE_CLASSES[step.tone]
            )}
          >
            <div className="flex w-full items-center justify-between gap-4">
              <span className="text-[13px] text-ink-700">{step.label}</span>
              <span className="text-[13px] font-semibold text-ink-900 tabular-nums">
                {step.value}
              </span>
            </div>
          </Progress>
        ))}
      </CardContent>
    </Card>
  );
}
