"use client";

import { Send, Trash2, UserCog } from "lucide-react";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import type {
  DataTableBulkAction,
  DataTableRowAction,
} from "@/components/shared/tables/types";
import { useModalController } from "@/hooks/useModalController";
import type { UserAccount } from "../../../../types/user";

const DELETE_MESSAGES = {
  success: { title: "Suppression", description: "Utilisateur supprimé avec succès." },
  error: { title: "Erreur", description: "Erreur lors de la suppression." },
};

const DELETE_MANY_MESSAGES = {
  success: { title: "Suppression", description: "Utilisateurs supprimés avec succès." },
  error: { title: "Erreur", description: "Erreur lors de la suppression." },
};

/**
 * Actions de la section Utilisateurs : colonne Actions et barre d'actions
 * groupées, même logique que `useEmailsTableActions`.
 *
 * "Modifier le rôle" et "Renvoyer l'invitation" restent des actions sans
 * effet (pas de modale d'édition de rôle ni d'API de renvoi conçues côté
 * maquette) — même traitement que l'action "Envoyé" des emails. Seule la
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
      id: "modifier-role",
      label: "Modifier le rôle",
      icon: UserCog,
      variant: "primary",
      isHidden: (user) => user.status === "pending",
      onSelect: () => null,
    },
    {
      id: "renvoyer-invitation",
      label: "Renvoyer l'invitation",
      icon: Send,
      variant: "primary",
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
