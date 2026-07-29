"use client";

import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  /** Nom de l'entité au pluriel, utilisé dans le compteur. */
  itemLabel?: string;
  className?: string;
};

/**
 * Pagination réutilisable : compteur « X résultats sur Y affichés » et
 * navigation page précédente / page suivante.
 *
 * Le compteur est annoncé aux lecteurs d'écran (`aria-live`) : sans lui, un
 * changement de page ne produirait aucun retour perceptible au clavier.
 */
export function DataTablePagination<TData>({
  table,
  itemLabel = "résultats",
  className,
}: DataTablePaginationProps<TData>) {
  const total = table.getFilteredRowModel().rows.length;
  const shown = table.getRowModel().rows.length;
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-t border-border pt-3.5",
        className
      )}
    >
      <p className="text-[13px] text-ink-500" aria-live="polite">
        {shown} {itemLabel} sur {total} affichés
        {pageCount > 1 ? ` — page ${pageIndex + 1} sur ${pageCount}` : ""}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="px-3.5 text-[13px]"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="px-3.5 text-[13px]"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </nav>
    </div>
  );
}
