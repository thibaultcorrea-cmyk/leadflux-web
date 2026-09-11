"use client";

import { KeyRound, Send, Trash2, UserCog } from "lucide-react";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import type {
  DataTableBulkAction,
  DataTableRowAction,
} from "@/components/shared/tables/types";
import { useModalController } from "@/hooks/useModalController";
import type { UserAccount } from "../types/user";

const DELETE_MESSAGES = {
  success: { title: "Suppression", description: "Utilisateur supprimé avec succès." },
  error: { title: "Erreur", description: "Erreur lors de la suppression." },
};

const DELETE_MANY_MESSAGES = {
  success: { title: "Suppression", description: "Utilisateurs supprimés avec succès." },
  error: { title: "Erreur", description: "Erreur lors de la suppression." },
};

/**
 * Actions de la section Utilisateurs : menu "⋯" par ligne et barre d'actions
 * groupées, même logique que `useEmailsTableActions` (juste un rendu en menu
 * déroulant plutôt qu'en boutons inline, cf. `createRowActionsMenuColumn`).
 *
 * "Modifier le profil" et "Changer le mot de passe" restent des actions sans
 * effet (pas de modale conçue côté maquette) — même traitement que l'action
 * "Envoyé" des emails — et n'ont pas de sens tant que l'invitation n'a pas été
 * acceptée, d'où leur masquage sur les comptes en attente. Seule la
 * suppression, seule action détaillée par la maquette (note de pied de
 * tableau), passe par une confirmation réelle.
 */
export function useUsersTableActions(
  users: UserAccount[],
  removeUsers: (ids: string[]) => Promise<void>
) {
  const { open } = useModalController();

  const confirm = (props: React.ComponentProps<typeof ConfirmModalContent>) =>
    open({ components: <ConfirmModalContent {...props} /> });

  const adminCount = users.filter((user) => user.role === "admin").length;

  const rowActions: DataTableRowAction<UserAccount>[] = [
    {
      id: "modifier-profil",
      label: "Modifier le profil",
      icon: UserCog,
      isHidden: (user) => user.status === "pending",
      onSelect: () => null,
    },
    {
      id: "changer-mot-de-passe",
      label: "Changer le mot de passe",
      icon: KeyRound,
      isHidden: (user) => user.status === "pending",
      onSelect: () => null,
    },
    {
      id: "renvoyer-invitation",
      label: "Renvoyer l'invitation",
      icon: Send,
      isHidden: (user) => user.status !== "pending",
      onSelect: () => null,
    },
    {
      id: "supprimer",
      label: "Supprimer",
      icon: Trash2,
      variant: "destructive",
      // Le dernier administrateur ne peut pas être retiré (note de la maquette).
      isDisabled: (user) => user.role === "admin" && adminCount <= 1,
      onSelect: (user) =>
        confirm({
          title: "Supprimer cet utilisateur",
          description: `Le compte de ${user.name} sera définitivement supprimé.`,
          confirmLabel: "Supprimer",
          tone: "destructive",
          onConfirm: async () => {
            await removeUsers([user.id]);
          },
          messages: DELETE_MESSAGES,
        }),
    },
  ];

  const bulkActions: DataTableBulkAction<UserAccount>[] = [
    {
      id: "supprimer-selection",
      label: "Supprimer la sélection",
      icon: Trash2,
      variant: "destructive",
      onSelect: (selected) =>
        confirm({
          title: "Supprimer la sélection",
          description: `${selected.length} compte${selected.length > 1 ? "s seront supprimés" : " sera supprimé"}.`,
          confirmLabel: "Supprimer",
          tone: "destructive",
          onConfirm: async () => {
            await removeUsers(selected.map((user) => user.id));
          },
          messages: DELETE_MANY_MESSAGES,
        }),
    },
  ];

  return { rowActions, bulkActions };
}
