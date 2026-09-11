import { CircleCheck, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { KnowledgeBaseVersion } from "../../../types/knowledge-base";

type KnowledgeBaseVersionBarProps = {
  version: KnowledgeBaseVersion;
};

export function KnowledgeBaseVersionBar({ version }: KnowledgeBaseVersionBarProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Badge
        variant="outline"
        className="h-auto gap-1.5 rounded-full border-transparent bg-success-50 px-2.5 py-1.5 text-xs font-semibold text-success"
      >
        <CircleCheck className="size-3.5" aria-hidden />
        Version {version.number} indexée · {version.indexedAtLabel} · {version.author}
      </Badge>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-9 gap-2 px-3.5 text-sm font-medium text-ink-900"
      >
        <History className="size-3.5" aria-hidden />
        Historique
      </Button>
    </div>
  );
}
