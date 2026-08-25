"use client";

import { Eye, Pencil, Repeat2, Reply, Send, Trash2 } from "lucide-react";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import type {
  DataTableBulkAction,
  DataTableRowAction,
} from "@/components/shared/tables/types";
import { useModalController } from "@/hooks/useModalController";
import { EmailPreviewModal } from "../components/modal/email-preview-modal";
import type { Email } from "../types/email";
import { useEmailPreviewAction } from "./useEmailPreviewAction";
import { useEmailMutation } from "./useEmailMutation";
import { useTransition } from "react";
import { waitDelay } from "@/lib/utils";

/** L'aperçu suit la longueur de ligne de lecture du design system : 720 px. */
const PREVIEW_MODAL_CLASSNAME = "sm:max-w-[720px]";

/**
 * Actions de l'onglet Emails : colonne Actions, barre d'actions groupées et
 * ouverture de l'aperçu.
 *
 * L'action principale d'une ligne **dépend de son statut** (Valider, Répondre,
 * Relancer). Elle est décrite ici par trois actions dont une seule est visible
 * à la fois : la définition des colonnes n'a pas à connaître cette règle.
 *
 * Les traitements réels (rédaction, envoi Gmail, suppression) restent à
 * brancher : le workflow n8n et le modèle Drizzle ne sont pas arrêtés
 * (CLAUDE.md §8).
 */
export function useEmailsTableActions() {

  const { open } = useModalController();

  const { openPreview, openEditView } = useEmailPreviewAction();
  const { remove } = useEmailMutation()
  const [isPending, startTransition] = useTransition()


  const removeEmails = async (ids: string[]) => {
    try {
      await remove({ ids })
    } catch (error) {
      throw new Error("Failed to remove emails")
    }
  }

  const confirm = (props: {
    title: string;
    description: React.ReactNode;
    confirmLabel: string;
    tone?: "default" | "destructive";
    isLoading?: boolean;
    onConfirm?: () => Promise<void>;
  }) => open({ components: <ConfirmModalContent {...props} /> });


  const rowActions: DataTableRowAction<Email>[] = [
    {
      // Volontairement en premier : on relit avant d'agir (CLAUDE.md §3).
      id: "apercu",
      label: "Aperçu de l'email",
      icon: Eye,
      variant: "ghost",
      onSelect: openPreview,
    },
    {
      id: "valider",
      label: "Valider",
      icon: Send,
      variant: "primary",
      isHidden: (email) => email.status !== "draft",
      onSelect: (email) =>
        confirm({
          title: "Valider et envoyer",
          description: `L'email sera envoyé à ${email.recipient}. C'est la seule étape qui déclenche un envoi.`,
          confirmLabel: "Valider et envoyer",
        }),
    },
    {
      id: "repondre",
      label: "Répondre",
      icon: Reply,
      variant: "primary",
      isHidden: (email) => email.status !== "replied",
      onSelect: (email) =>
        confirm({
          title: "Répondre",
          description: `Une réponse sera préparée pour ${email.contactName}, en brouillon comme le reste.`,
          confirmLabel: "Préparer la réponse",
        }),
    },
    {
      id: "relancer",
      label: "Relancer",
      icon: Repeat2,
      variant: "primary",
      isHidden: (email) => email.status !== "sent",
      onSelect: (email) =>
        confirm({
          title: "Relancer",
          description: `Une relance sera rédigée pour ${email.contactName}, à valider avant envoi.`,
          confirmLabel: "Préparer la relance",
        }),
    },
    {
      id: "modifier",
      label: "Modifier l'email",
      icon: Pencil,
      variant: "ghost",
      onSelect: openEditView,
    },
    {
      id: "supprimer",
      label: "Supprimer l'email",
      icon: Trash2,
      variant: "destructive",
      onSelect: (email) =>
        confirm({
          title: "Supprimer cet email",
          description: `Le suivi de l'email adressé à ${email.contactName} sera supprimé. Cette action est définitive.`,
          confirmLabel: "Supprimer",
          tone: "destructive",
          onConfirm: async () => {
            await removeEmails([email.id])
          }

        }),
    },
  ];

  const bulkActions: DataTableBulkAction<Email>[] = [
    {
      id: "valider-selection",
      label: "Valider et envoyer la sélection",
      icon: Send,
      onSelect: (selected) =>
        // Garde-fou produit (CLAUDE.md §3) : sans relecture un par un, ce
        // bouton recréerait l'envoi automatique que le produit interdit. Le
        // parcours de validation séquentiel reste à construire.
        confirm({
          title: "Valider et envoyer la sélection",
          description: `${selected.length} email${selected.length > 1 ? "s vous seront présentés" : " vous sera présenté"} un par un pour relecture avant envoi. Aucun envoi groupé sans relecture.`,
          confirmLabel: "Relire les brouillons",
        }),
    },
    {
      id: "supprimer-selection",
      label: "Supprimer la sélection",
      icon: Trash2,
      variant: "destructive",
      onSelect: (selected) =>
        confirm({
          title: "Supprimer la sélection",
          description: `${selected.length} email${selected.length > 1 ? "s seront supprimés" : " sera supprimé"} .`,
          confirmLabel: "Supprimer",
          tone: "destructive",
          onConfirm: async () => {
            await removeEmails(selected.map((email) => email.id))
          }
        }),
    },
  ];

  return { isPending, rowActions, bulkActions, openPreview };
}
