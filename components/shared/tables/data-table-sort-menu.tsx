"use client";

import type { Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_VALUE = "__default__";

/**
 * Menu de tri : reprend les colonnes triables du tableau et laisse choisir sur
 * laquelle trier, en plus des flèches disponibles dans les en-têtes.
 *
 * Choisir la colonne déjà active inverse le sens du tri. `defaultLabel` décrit
 * l'ordre naturel des données (« pertinence » pour un sourcing), c'est-à-dire
 * l'absence de tri explicite.
 */
export function DataTableSortMenu<TData>({
  table,
  defaultLabel = "pertinence",
}: {
  table: Table<TData>;
  defaultLabel?: string;
}) {
  const sortableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanSort());

  if (sortableColumns.length === 0) {
    return null;
  }

  const [activeSort] = table.getState().sorting;
  const activeColumn = activeSort
    ? sortableColumns.find((column) => column.id === activeSort.id)
    : undefined;
  const activeLabel = activeColumn
    ? (activeColumn.columnDef.meta?.label ?? activeColumn.id)
    : defaultLabel;

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
        Trier : {activeLabel}
        <ChevronDown className="size-3.5 text-ink-500" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 min-w-56">
        <DropdownMenuRadioGroup
          value={activeColumn?.id ?? DEFAULT_VALUE}
          onValueChange={(value) => {
            if (value === DEFAULT_VALUE) {
              table.resetSorting();
              return;
            }

            const column = table.getColumn(value);
            if (!column) return;

            // Re-choisir la colonne active inverse le sens du tri.
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          <DropdownMenuRadioItem value={DEFAULT_VALUE}>
            Par {defaultLabel}
          </DropdownMenuRadioItem>
          {sortableColumns.map((column) => {
            const sorted = column.getIsSorted();

            return (
              <DropdownMenuRadioItem key={column.id} value={column.id}>
                {column.columnDef.meta?.label ?? column.id}
                {sorted === "asc" ? (
                  <ArrowUp className="ml-1 size-3.5 text-ink-500" aria-hidden />
                ) : sorted === "desc" ? (
                  <ArrowDown
                    className="ml-1 size-3.5 text-ink-500"
                    aria-hidden
                  />
                ) : null}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
