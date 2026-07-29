"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EmailStatusBadge } from "@/components/shared/badges/email-status-badge";
import { DataTableColumnHeader } from "@/components/shared/tables/data-table-column-header";
import { createRowActionsColumn } from "@/components/shared/tables/data-table-row-actions";
import { createSelectionColumn } from "@/components/shared/tables/data-table-selection-column";
import type { DataTableRowAction } from "@/components/shared/tables/types";
import type { Email } from "../../types/email";
import { ActivityCell } from "./cells/activity-cell";
import { ProspectCell } from "./cells/prospect-cell";
import { SubjectCell } from "./cells/subject-cell";

/**
 * Colonnes de la table des emails. Les actions sont injectées par la page :
 * la définition des colonnes reste une description de données.
 */
export function getEmailsColumns(
  rowActions: DataTableRowAction<Email>[]
): ColumnDef<Email>[] {
  return [
    createSelectionColumn<Email>({
      getRowLabel: (email) => `l'email adressé à ${email.contactName}`,
    }),
    {
      accessorKey: "contactName",
      meta: { label: "Prospect" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prospect" />
      ),
      cell: ({ row }) => (
        <ProspectCell
          name={row.original.contactName}
          company={row.original.company}
        />
      ),
    },
    {
      // L'objet vit dans la dernière génération de l'email, pas sur la ligne.
      id: "subject",
      accessorFn: (email) => email.versions.at(-1)?.subject ?? "",
      size: 330,
      meta: { label: "Objet de l'email", cellClassName: "max-w-0" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Objet de l'email" />
      ),
      cell: ({ row }) => (
        <SubjectCell subject={row.original.versions.at(-1)?.subject ?? ""} />
      ),
    },
    {
      accessorKey: "status",
      size: 150,
      enableSorting: false,
      meta: { label: "Statut" },
      header: "Statut",
      cell: ({ row }) => <EmailStatusBadge status={row.original.status} />,
    },
    {
      // Tri sur la date ISO, affichage du libellé relatif : « Hier » ne se trie pas.
      id: "lastActivity",
      accessorFn: (email) => new Date(email.lastActivityAt).getTime(),
      size: 130,
      meta: { label: "Dernière activité" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dernière activité" />
      ),
      cell: ({ row }) => (
        <ActivityCell
          label={row.original.lastActivityLabel}
          isoDate={row.original.lastActivityAt}
        />
      ),
    },
    createRowActionsColumn<Email>({ actions: rowActions, size: 240 }),
  ];
}
