"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

type SelectionColumnOptions<TData> = {
  /** Libellé accessible de la case d'une ligne, ex. `(p) => p.company`. */
  getRowLabel?: (row: TData) => string;
  size?: number;
};

/**
 * Colonne de sélection multiple réutilisable : case « tout sélectionner » en
 * en-tête (avec état intermédiaire quand la page n'est que partiellement
 * cochée) et une case par ligne.
 *
 * La sélection est portée par TanStack Table, donc elle survit au tri et à la
 * pagination dès lors que `useDataTable` reçoit un `getRowId` stable.
 */
export function createSelectionColumn<TData>({
  getRowLabel,
  size = 40,
}: SelectionColumnOptions<TData> = {}): ColumnDef<TData> {
  return {
    id: "select",
    size,
    enableSorting: false,
    enableHiding: false,
    meta: { label: "Sélection" },
    header: ({ table }) => {
      const allSelected = table.getIsAllPageRowsSelected();

      return (
        <Checkbox
          checked={allSelected}
          indeterminate={!allSelected && table.getIsSomePageRowsSelected()}
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(checked)
          }
          aria-label="Tout sélectionner"
          className="data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground data-indeterminate:before:absolute data-indeterminate:before:h-0.5 data-indeterminate:before:w-2 data-indeterminate:before:rounded-full data-indeterminate:before:bg-current [&[data-indeterminate]_svg]:hidden"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        aria-label={
          getRowLabel
            ? `Sélectionner ${getRowLabel(row.original)}`
            : "Sélectionner la ligne"
        }
      />
    ),
  };
}
