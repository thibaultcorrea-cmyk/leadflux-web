"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useResetApplicationAction } from "../hooks/useResetApplicationAction";

/**
 * Corps de la section "Zone sensible" : une seule action pour l'instant
 * (réinitialiser Leadflux), présentée dans un encart au ton d'avertissement
 * plutôt que dans la carte neutre des autres sections. C'est une remise à
 * zéro complète : elle supprime aussi le compte administrateur courant, pas
 * seulement les données de démonstration. La confirmation par mot à saisir
 * (cf. `ConfirmModalContent`) est le garde-fou supplémentaire pour une action
 * qui déconnecte immédiatement l'administrateur.
 */
export function ZoneSensibleSection() {
  const { openResetApplication } = useResetApplicationAction();

  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/10">
          <TriangleAlert className="size-[18px] text-destructive" aria-hidden />
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-ink-900">Réinitialiser Leadflux</p>
          <p className="max-w-[62ch] text-xs leading-normal text-ink-500">
            Remise à zéro complète : supprime toutes les données, y compris le compte
            administrateur, puis vous déconnecte immédiatement. Aucune sauvegarde automatique
            n&apos;existe côté serveur.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="destructive"
        size="lg"
        className="h-10 shrink-0 gap-2 px-4 text-sm font-semibold"
        onClick={openResetApplication}
      >
        <RotateCcw className="size-[15px]" aria-hidden />
        Réinitialiser
      </Button>
    </div>
  );
}
