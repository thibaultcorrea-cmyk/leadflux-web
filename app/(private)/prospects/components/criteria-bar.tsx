"use client";

import { Badge } from "@/components/ui/badge";
import { useSearchModal } from "@/hooks/useSearchModal";
import type { SearchCriterion } from "../types/prospect";

/**
 * Rappel des critères du sourcing en cours, au-dessus des résultats.
 *
 * « Modifier les critères » rouvre la modale de recherche : c'est le troisième
 * point d'entrée prévu, avec les deux boutons « Nouvelle recherche ».
 */
export function CriteriaBar({ criteria }: { criteria: SearchCriterion[] }) {
  const { openSearchModal } = useSearchModal();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background-100 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-ink-500">Critères</span>
        {criteria.map((criterion) => (
          <Badge
            key={criterion.id}
            className="h-auto rounded-full border-accent-500 bg-accent-50 px-3 py-1.5 text-[13px] font-medium text-accent-700"
          >
            {criterion.label}
          </Badge>
        ))}
      </div>

      <button
        type="button"
        onClick={openSearchModal}
        className="rounded-sm text-[13px] font-semibold text-accent-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        Modifier les critères
      </button>
    </div>
  );
}
