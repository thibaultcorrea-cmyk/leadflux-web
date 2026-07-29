"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
};

/**
 * En-tête de colonne. Rend un simple libellé si la colonne n'est pas triable,
 * sinon un bouton qui cycle croissant → décroissant → aucun tri.
 *
 * L'état de tri est annoncé deux fois : visuellement par la flèche, et pour les
 * lecteurs d'écran par l'`aria-sort` posé sur le `<th>` par `DataTable`.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      aria-label={
        sorted === "asc"
          ? `${title} : trié par ordre croissant, trier par ordre décroissant`
          : sorted === "desc"
            ? `${title} : trié par ordre décroissant, retirer le tri`
            : `${title} : trier par ordre croissant`
      }
      className={cn(
        "-mx-1 inline-flex items-center gap-1.5 rounded-sm px-1 py-0.5 transition-colors outline-none hover:text-ink-700 focus-visible:ring-2 focus-visible:ring-ring",
        sorted && "text-ink-700",
        className
      )}
    >
      {title}
      <Icon
        className={cn("size-3.5", sorted ? "text-accent-600" : "text-ink-300")}
        aria-hidden
      />
    </button>
  );
}
