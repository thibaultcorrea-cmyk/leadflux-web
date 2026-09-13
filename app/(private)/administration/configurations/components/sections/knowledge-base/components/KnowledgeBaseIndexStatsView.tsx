import { Layers, RefreshCw } from "lucide-react";

import type { KnowledgeBaseFile, KnowledgeBaseIndexStats } from "../../../../types/knowledge-base";

type KnowledgeBaseIndexStatsViewProps = {
  file: KnowledgeBaseFile;
};

export function KnowledgeBaseIndexStatsView({ file }: KnowledgeBaseIndexStatsViewProps) {

  const stats: KnowledgeBaseIndexStats = {
    passagesIndexed: file.wordCount,
    reindexedAtLabel: `il y a ${file.distanceDateTime}`
  }

  return (
    <div className="flex flex-wrap items-center gap-3.5">
      <span className="flex items-center gap-2 text-xs font-semibold text-ink-700">
        <Layers className="size-3.5 text-success" aria-hidden />
        {stats.passagesIndexed} passages indexés
      </span>
      <span className="h-3.5 w-px bg-border" aria-hidden />
      <span className="flex items-center gap-2 text-xs font-semibold text-ink-700">
        <RefreshCw className="size-3.5 text-success" aria-hidden />
        Réindexé {stats.reindexedAtLabel}
      </span>
    </div>
  );
}
