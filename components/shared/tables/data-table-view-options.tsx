"use client";

import type { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Choix des colonnes affichées. Réutilisable par tout tableau : les libellés
 * viennent de `meta.label` de chaque `ColumnDef`, jamais de l'`id` technique.
 *
 * Une colonne se retire du menu avec `enableHiding: false` (sélection, actions).
 */
export function DataTableViewOptions<TData>({
  table,
  label = "Colonnes",
}: {
  table: Table<TData>;
  label?: string;
}) {
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  if (hideableColumns.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2 px-3 text-[13px] font-medium text-ink-700"
          />
        }
      >
        <SlidersHorizontal className="size-3.5 text-ink-500" aria-hidden />
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 min-w-52">
        <DropdownMenuLabel>Colonnes affichées</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(checked)}
            closeOnClick={false}
          >
            {column.columnDef.meta?.label ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
