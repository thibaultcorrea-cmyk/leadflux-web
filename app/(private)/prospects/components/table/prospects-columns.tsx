"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/shared/tables/data-table-column-header";
import { createRowActionsColumn } from "@/components/shared/tables/data-table-row-actions";
import { createSelectionColumn } from "@/components/shared/tables/data-table-selection-column";
import type { DataTableRowAction } from "@/components/shared/tables/types";
import type { Prospect } from "../../types/prospect";
import { CompanyCell } from "./cells/company-cell";
import { DecisionMakerCell } from "./cells/decision-maker-cell";
import { SectorCell } from "./cells/sector-cell";
import { TextCell } from "./cells/text-cell";

/**
 * Définition des colonnes de la table de résultats de sourcing.
 *
 * Les actions sont injectées par la page (via son hook d'actions) plutôt que
 * codées ici : la définition des colonnes reste une description de données, et
 * la même table peut servir avec un autre jeu d'actions.
 */
export function getProspectsColumns(
  rowActions: DataTableRowAction<Prospect>[]
): ColumnDef<Prospect>[] {
  return [
    createSelectionColumn<Prospect>({
      getRowLabel: (prospect) => prospect.company,
    }),
    {
      accessorKey: "company",
      meta: { label: "Entreprise" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entreprise" />
      ),
      cell: ({ row }) => <CompanyCell company={row.original.company} />,
    },
    {
      accessorKey: "contactName",
      size: 190,
      meta: { label: "Décideur" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Décideur" />
      ),
      cell: ({ row }) => (
        <DecisionMakerCell
          name={row.original.contactName}
          role={row.original.contactRole}
        />
      ),
    },
    {
      accessorKey: "sector",
      size: 165,
      meta: { label: "Secteur" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Secteur" />
      ),
      cell: ({ row }) => <SectorCell sector={row.original.sector} />,
    },
    {
      accessorKey: "city",
      size: 110,
      meta: { label: "Ville" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ville" />
      ),
      cell: ({ row }) => <TextCell value={row.original.city} />,
    },
    {
      // Le tri suit la borne basse de la tranche, pas le libellé : « 8-15 salariés »
      // doit venir après « 3-8 salariés », pas dans l'ordre alphabétique.
      id: "headcount",
      accessorFn: (prospect) => prospect.headcountMin,
      size: 120,
      meta: { label: "Taille" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Taille" />
      ),
      cell: ({ row }) => <TextCell value={row.original.headcountLabel} />,
    },
    createRowActionsColumn<Prospect>({ actions: rowActions, size: 220 }),
  ];
}
