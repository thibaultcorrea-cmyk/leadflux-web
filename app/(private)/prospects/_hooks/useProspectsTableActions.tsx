"use client";

import { Pencil, Plus, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import type {
  DataTableBulkAction,
  DataTableRowAction,
} from "@/components/shared/tables/types";
import { useModalController } from "@/hooks/useModalController";
import type { Prospect } from "../types/prospect";
import { EditProspectModal } from "../components/modals/EditProspectView";
import { hiddenRowActions } from "../services/row-actions";
import { useProspectMutation } from "./useProspectMutation";
import { waitDelay } from "@/lib/utils";
import { dialogMessages } from "../services/dialog-messages";
import { toast } from "@/lib/toaster";

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
  const { sendProspectEmail, deleteProspects } = useProspectMutation();

  const [resultCount, setResultCount] = useState<{ send: number, failed: number }>({ send: 0, failed: 0 });

  const sendProspect = async (prospects: Prospect[]) => {
    await waitDelay(1500);
    const { generateEmailContent: { send, failed } } = await sendProspectEmail(prospects);
    setResultCount({ send, failed });
  }

  const removeProspectFromSearch = async (ids: string[]) => {
    await waitDelay(1500);
    await deleteProspects(ids);

  }




  return useMemo(() => {
    const rowActions: DataTableRowAction<Prospect>[] = [
      {
        id: "prospecter",
        label: "Prospecter",
        icon: Send,
        variant: "primary",
        isDisabled: (prospect: Prospect) => prospect.prospectedAt ? true : false,
        onSelect: (prospect: Prospect) =>
          open({
            components: (
              <ConfirmModalContent
                title="Prospecter ce contact"
                description={`Un brouillon d'email sera rédigé pour ${prospect.contactName} (${prospect.company}). Rien n'est envoyé : le brouillon reste à valider.`}
                confirmLabel="Rédiger le brouillon"
                onConfirm={() => sendProspect([prospect])}
                messages={dialogMessages.drafting(resultCount)}
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
        onSelect: (prospect: Prospect) =>
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
        onSelect: (prospect: Prospect) =>
          open({
            components: (
              <ConfirmModalContent
                title="Retirer ce résultat"
                description={`${prospect.company} sera retirée des résultats de ce sourcing. Cette action est définitive pour cette recherche.`}
                confirmLabel="Retirer"
                tone="destructive"
                onConfirm={() => removeProspectFromSearch([prospect.id])}
                messages={dialogMessages.deletion}
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
                onConfirm={() => sendProspect(selected)}
                messages={dialogMessages.draftingMany(resultCount)}
              />
            ),
          }),
      },
      {
        id: "delete-selection",
        label: "Supprimer la sélection",
        icon: Trash2,
        variant: "destructive",
        onSelect: (selected) =>
          open({
            components: (
              <ConfirmModalContent
                title="Supprimer la sélection"
                description={`${selected.length} brouillon${selected.length > 1 ? "s seront supprimés" : " sera supprimé"}, puis présenté${selected.length > 1 ? "s" : ""} un par un pour validation. Aucun email n'est envoyé automatiquement.`}
                confirmLabel="Supprimer"
                tone="destructive"
                onConfirm={() => removeProspectFromSearch(selected.map((prospect) => prospect.id))}
                messages={dialogMessages.deletionMany}
              />
            ),
          }),
      }
    ];


    const filteredRowActions = rowActions.filter((action) => !hiddenRowActions.includes(action.id));

    return { rowActions: filteredRowActions, bulkActions };
  }, [open]);
}
