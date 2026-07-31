"use client";

import { cn } from "@/lib/utils";

export type StatusFilterItem<TValue extends string> = {
  value: TValue;
  label: string;
  count: number;
};

type DataTableStatusFilterProps<TValue extends string> = {
  items: StatusFilterItem<TValue>[];
  value: TValue;
  onValueChange: (value: TValue) => void;
  /** Nom du groupe pour les lecteurs d'écran. */
  label: string;
  className?: string;
};

/**
 * Barre de filtres d'un tableau, avec compteur par valeur.
 *
 * Ce sont bien des **filtres**, pas des onglets : ils ne changent pas de vue,
 * ils restreignent les lignes du tableau en dessous. D'où des boutons avec
 * `aria-pressed` plutôt qu'un `tablist`, et une valeur portée par l'URL côté
 * appelant — une vue filtrée se partage et se recharge à l'identique.
 */
export function DataTableStatusFilter<TValue extends string>({
  items,
  value,
  onValueChange,
  label,
  className,
}: DataTableStatusFilterProps<TValue>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex flex-wrap items-end gap-x-7 gap-y-1 border-b border-border",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 border-transparent pb-3 text-sm font-medium text-ink-500 transition-colors outline-none",
              "hover:text-ink-900 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring",
              isActive && "border-accent-500 font-semibold text-ink-900"
            )}
          >
            {item.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "bg-muted text-ink-500"
              )}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
