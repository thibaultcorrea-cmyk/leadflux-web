"use client";

import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData> = {
  /** Instance construite par `useDataTable` : c'est elle qui porte tri, sélection et pagination. */
  table: TanstackTable<TData>;
  /** Affiché à la place des lignes quand le tableau est vide. */
  emptyMessage?: string;
  className?: string;
};

/**
 * Rendu générique des tableaux de l'application : toute page passe par lui
 * plutôt que d'écrire son propre `<table>`.
 *
 * La logique (colonnes, tri, sélection, pagination) vient de TanStack Table via
 * `useDataTable`, le markup et l'accessibilité de shadcn/ui, l'apparence de la
 * DA (`design.md`). Ce composant ne détient aucun état.
 */
export function DataTable<TData>({
  table,
  emptyMessage = "Aucune donnée à afficher.",
  className,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleFlatColumns().length;

  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-b-border hover:bg-transparent"
          >
            {headerGroup.headers.map((header) => {
              const { size, meta } = header.column.columnDef;
              const sorted = header.column.getIsSorted();

              return (
                <TableHead
                  key={header.id}
                  style={size ? { width: size } : undefined}
                  aria-sort={
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : header.column.getCanSort()
                          ? "none"
                          : undefined
                  }
                  className={cn(
                    "h-auto px-0 pr-4 pb-2.5 text-xs font-medium tracking-[0.03em] text-ink-500 last:pr-0",
                    meta?.headerClassName
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={visibleColumnCount}
              className="py-8 text-center text-ink-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
              className="border-b-0 border-t border-t-border transition-colors hover:bg-background-100 data-[state=selected]:bg-accent-50"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "px-0 py-3 pr-4 align-middle last:pr-0",
                    cell.column.columnDef.meta?.cellClassName
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
