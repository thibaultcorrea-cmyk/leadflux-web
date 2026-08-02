"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableBulkAction } from "./types";
import { ActionBar, ActionBarClose, ActionBarGroup, ActionBarItem, ActionBarSelection, ActionBarSeparator } from "@/components/ui/action-bar";
import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DataTableSelectionActionsProps<TData> = {
  selectedRows: TData[];
  actions: DataTableBulkAction<TData>[];
  onClearSelection?: () => void;
};

/**
 * Barre d'actions groupées, affichée seulement quand au moins une ligne est
 * cochée. Le nombre de lignes sélectionnées est écrit en toutes lettres à côté
 * du bouton : l'utilisateur doit savoir sur combien de lignes il agit.
 */
export function DataTableSelectionActions<TData>({
  selectedRows,
  actions,
  onClearSelection,
}: DataTableSelectionActionsProps<TData>) {
  const count = selectedRows.length;



  const open = useMemo(() => count > 0 && actions.length > 0, [count, actions.length]);



  return (
    /* <div className="flex flex-wrap items-center gap-2.5">
       <Badge className="h-auto bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700">
         {count} sélectionné{count > 1 ? "s" : ""}
       </Badge>
 
       {actions.map((action) => {
         const Icon = action.icon;
 
         return (
           <Button
             key={action.id}
             type="button"
             size="lg"
             className="gap-2 px-3.5 text-[13px] font-semibold"
             onClick={() => action.onSelect(selectedRows)}
           >
             {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
             {action.label}
           </Button>
         );
       })}
 
       {onClearSelection ? (
         <Button
           type="button"
           variant="ghost"
           size="lg"
           className="px-2.5 text-[13px] text-ink-500"
           onClick={onClearSelection}
         >
           Annuler la sélection
         </Button>
       ) : null}
     </div>*/

    <ActionBar open={open} onOpenChange={onClearSelection}  >
      <ActionBarSelection >
        {count} sélectionné{count > 1 ? "s" : ""}

        <ActionBarSeparator />
        <ActionBarClose className="cursor-pointer">
          <X />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <ActionBarItem key={action.id} className={cn("gap-2", action.className)}
              onClick={() => action.onSelect(selectedRows)} >

              {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
              {action.label}

            </ActionBarItem>
          );
        })}

      </ActionBarGroup>
      <ActionBarClose />
    </ActionBar>


  );
}
