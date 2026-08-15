"use client";

import { Pencil, Plus, Send, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import type {
  DataTableBulkAction,
  DataTableRowAction,
} from "@/components/shared/tables/types";
import { useModalController } from "@/hooks/useModalController";
import type { Prospect } from "../types/prospect";
import { EditProspectModal } from "../components/modals/EditProspectView";

/**
 * Actions de la table de résultats : une seule source pour la colonne Actions
 * et pour la barre d'actions groupées.
 *
 * Les colonnes ne connaissent pas ces handlers, elles reçoivent la liste :
 * la même table peut donc être rendue avec un autre jeu d'actions (lecture
 * seule, écran d'administration…) sans toucher aux colonnes.
 *
 * Les traitements réels (rédaction d'email, ajout à la liste, suppression)
 * restent à brancher : le sourcing n8n et le modèle Drizzle ne sont pas encore
 * arrêtés (CLAUDE.md §8).
 */
export function useProspectsTableActions() {
  const { open } = useModalController();

  return useMemo(() => {
    const rowActions: DataTableRowAction<Prospect>[] = [
      {
        id: "prospecter",
        label: "Prospecter",
        icon: Send,
        variant: "primary",
        onSelect: (prospect) =>
          open({
            components: (
              <ConfirmModalContent
                title="Prospecter ce contact"
                description={`Un brouillon d'email sera rédigé pour ${prospect.contactName} (${prospect.company}). Rien n'est envoyé : le brouillon reste à valider.`}
                confirmLabel="Rédiger le brouillon"
              />
            ),
          }),
      },
      {
        id: "ajouter",
        label: "Ajouter à mes prospects",
        icon: Plus,
        variant: "ghost",
        onSelect: (prospect) =>
          open({
            components: (
              <ConfirmModalContent
                title="Ajouter à mes prospects"
                description={`${prospect.company} sera ajoutée à votre liste de prospects suivis.`}
                confirmLabel="Ajouter"
              />
            ),
          }),
      },
      {
        id: "modifier",
        label: "Modifier la fiche",
        icon: Pencil,
        variant: "ghost",
        onSelect: (prospect) =>
          open({
            components: (
              <EditProspectModal
                prospect={prospect}
              />
            ),
            contentClassName: "!min-w-fit"
          }),
      },
      {
        id: "supprimer",
        label: "Retirer des résultats",
        icon: Trash2,
        variant: "destructive",
        onSelect: (prospect) =>
          open({
            components: (
              <ConfirmModalContent
                title="Retirer ce résultat"
                description={`${prospect.company} sera retirée des résultats de ce sourcing. Cette action est définitive pour cette recherche.`}
                confirmLabel="Retirer"
                tone="destructive"
              />
            ),
          }),
      },
    ];

    const bulkActions: DataTableBulkAction<Prospect>[] = [
      {
        id: "prospecter-selection",
        label: "Prospecter la sélection",
        icon: Send,
        onSelect: (selected) =>
          open({
            // Garde-fou produit (CLAUDE.md §3) : une action groupée ne doit pas
            // recréer l'envoi automatique. La relecture brouillon par brouillon
            // reste obligatoire — le parcours de validation un par un est à
            // construire, cette confirmation en pose la règle.
            components: (
              <ConfirmModalContent
                title="Prospecter la sélection"
                description={`${selected.length} brouillon${selected.length > 1 ? "s seront rédigés" : " sera rédigé"}, puis présenté${selected.length > 1 ? "s" : ""} un par un pour validation. Aucun email n'est envoyé automatiquement.`}
                confirmLabel="Rédiger les brouillons"
              />
            ),
          }),
      },
    ];

    return { rowActions, bulkActions };
  }, [open]);
}
