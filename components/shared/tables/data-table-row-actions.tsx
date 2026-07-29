"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DataTableRowAction } from "./types";

type RowActionsColumnOptions<TData> = {
  actions: DataTableRowAction<TData>[];
  header?: string;
  size?: number;
};

/**
 * Colonne « Actions » personnalisable : chaque page fournit sa liste d'actions
 * (généralement depuis son hook d'actions), le rendu et l'accessibilité sont
 * mutualisés ici.
 *
 * L'ordre d'affichage est celui du tableau `actions` : action principale
 * d'abord, puis les boutons icône seule.
 */
export function createRowActionsColumn<TData>({
  actions,
  header = "Actions",
  size = 220,
}: RowActionsColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: "actions",
    header,
    size,
    enableSorting: false,
    enableHiding: false,
    meta: { label: header },
    cell: ({ row }) => (
      <DataTableRowActions actions={actions} row={row.original} />
    ),
  };
}

/**
 * Barre d'actions d'une ligne. Les boutons icône seule portent toujours une
 * infobulle **et** un `aria-label` : une icône muette n'est jamais livrée
 * (design.md §6).
 */
export function DataTableRowActions<TData>({
  actions,
  row,
}: {
  actions: DataTableRowAction<TData>[];
  row: TData;
}) {
  const visibleActions = actions.filter((action) => !action.isHidden?.(row));

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {visibleActions.map((action) => {
        const Icon = action.icon;
        const disabled = action.isDisabled?.(row) ?? false;

        if (action.variant === "primary") {
          return (
            <Button
              key={action.id}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => action.onSelect(row)}
              className="h-7.5 gap-1.5 border-accent-500 bg-accent-50 px-2.5 text-xs font-semibold text-accent-700 hover:bg-accent-100 hover:text-accent-800"
            >
              <Icon className="size-3.5" aria-hidden />
              {action.label}
            </Button>
          );
        }

        return (
          <Tooltip key={action.id}>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label={action.label}
                  onClick={() => action.onSelect(row)}
                  className={cn(
                    "text-ink-700",
                    action.variant === "destructive" &&
                      "text-destructive hover:bg-destructive/10 hover:text-destructive"
                  )}
                />
              }
            >
              <Icon className="size-3.5" aria-hidden />
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
