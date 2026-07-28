"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Affiché à la place des lignes quand `data` est vide. */
  emptyMessage?: string;
  className?: string;
};

/**
 * Tableau générique de l'application : toute page passe par lui plutôt que
 * d'écrire son propre `<table>`. La logique (colonnes, tri, accesseurs) vient
 * de TanStack Table, le markup et l'accessibilité de shadcn/ui.
 *
 * Le tri s'active colonne par colonne via `enableSorting` dans la `ColumnDef`.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "Aucune donnée à afficher.",
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-b-border hover:bg-transparent"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={
                  header.column.columnDef.size
                    ? { width: header.column.columnDef.size }
                    : undefined
                }
                aria-sort={
                  header.column.getIsSorted() === "asc"
                    ? "ascending"
                    : header.column.getIsSorted() === "desc"
                      ? "descending"
                      : undefined
                }
                className="h-auto px-0 pr-4 pb-2.5 text-xs font-medium tracking-[0.03em] text-ink-500 last:pr-0"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="py-8 text-center text-ink-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                "border-b-0 border-t border-t-border hover:bg-background-100"
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-0 pr-4 py-3 last:pr-0">
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
