"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/shared/tables/data-table-column-header";
import { createRowActionsMenuColumn } from "@/components/shared/tables/data-table-row-actions";
import { createSelectionColumn } from "@/components/shared/tables/data-table-selection-column";
import type { DataTableRowAction } from "@/components/shared/tables/types";
import type { UserAccount } from "../../types/user";
import { RoleBadge } from "./RoleBadge";
import { StatusIndicator } from "./StatusIndicator";
import { UserCell } from "./UserCell";

/**
 * Colonnes de la table Utilisateurs. Les actions sont injectées par la page
 * (`useUsersTableActions`) : la définition des colonnes reste une description
 * de données, même logique que `getEmailsColumns`.
 */
export function getUsersColumns(
  rowActions: DataTableRowAction<UserAccount>[]
): ColumnDef<UserAccount>[] {
  return [
    createSelectionColumn<UserAccount>({
      getRowLabel: (user) => `le compte de ${user.name}`,
    }),
    {
      accessorKey: "name",
      size: 260,
      meta: { label: "Utilisateur" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Utilisateur" />
      ),
      cell: ({ row }) => <UserCell user={row.original} />,
    },
    {
      accessorKey: "role",
      size: 100,
      meta: { label: "Rôle" },
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "status",
      size: 190,
      enableSorting: false,
      meta: { label: "Statut" },
      header: "Statut",
      cell: ({ row }) => <StatusIndicator status={row.original.status} />,
    },
    {
      // Tri sur la date ISO, affichage du libellé de la maquette : "Hier" ne se trie pas.
      id: "lastActivity",
      accessorFn: (user) => (user.lastActivityAt ? new Date(user.lastActivityAt).getTime() : 0),
      size: 150,
      meta: { label: "Dernière connexion" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dernière connexion" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-ink-700">{row.original.lastActivityLabel}</span>
      ),
    },
    createRowActionsMenuColumn<UserAccount>({
      actions: rowActions,
      size: 60,
      triggerLabel: "Actions sur cet utilisateur",
    }),
  ];
}
