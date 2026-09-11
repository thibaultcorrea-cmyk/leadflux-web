import { Layers, RefreshCw } from "lucide-react";

import type { KnowledgeBaseIndexStats } from "../../../../types/knowledge-base";

type KnowledgeBaseIndexStatsViewProps = {
  stats: KnowledgeBaseIndexStats;
};

export function KnowledgeBaseIndexStatsView({ stats }: KnowledgeBaseIndexStatsViewProps) {
  return (
    <div className="flex flex-wrap items-center gap-3.5">
      <span className="flex items-center gap-2 text-xs font-semibold text-ink-700">
        <Layers className="size-3.5 text-success" aria-hidden />
        {stats.passagesIndexed} passages indexés
      </span>
      <span className="h-3.5 w-px bg-border" aria-hidden />
      <span className="flex items-center gap-2 text-xs font-semibold text-ink-700">
        <RefreshCw className="size-3.5 text-success" aria-hidden />
        Réindexé le {stats.reindexedAtLabel}
      </span>
    </div>
  );
}
