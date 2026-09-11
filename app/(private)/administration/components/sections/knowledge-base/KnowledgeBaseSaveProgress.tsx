import { Progress } from "@/components/ui/progress";

type KnowledgeBaseSaveProgressProps = {
  progress: number;
};

/** Remplace KnowledgeBaseIndexStatsView pendant l'enregistrement/réindexation simulés. */
export function KnowledgeBaseSaveProgress({ progress }: KnowledgeBaseSaveProgressProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
        <span>Enregistrement et réindexation…</span>
        <span className="tabular-nums">{progress}%</span>
      </div>
      <Progress value={progress} className="[&_[data-slot=progress-track]]:h-1.5" />
    </div>
  );
}
