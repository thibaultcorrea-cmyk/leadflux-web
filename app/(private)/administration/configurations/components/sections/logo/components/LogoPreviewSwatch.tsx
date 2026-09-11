import { Radar } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoPreviewSwatchProps = {
  variant: "dark" | "light";
  caption: string;
};

/**
 * Reprend la marque Leadflux (icône Radar + wordmark) déjà utilisée dans
 * AppSidebar, ici déclinée sur fond sombre et fond clair pour vérifier la
 * lisibilité du logo dans les deux contextes où il apparaît réellement
 * (barre latérale, signature d'email).
 */
export function LogoPreviewSwatch({ variant, caption }: LogoPreviewSwatchProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "flex h-24 w-[150px] flex-col items-center justify-center gap-2 rounded-md border border-border",
        isDark ? "bg-primary-700" : "bg-background"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-[26px] items-center justify-center rounded-[7px]",
            isDark ? "bg-primary-800" : "bg-primary-50"
          )}
        >
          <Radar className="size-[15px] text-accent-500" aria-hidden />
        </span>
        <span
          className={cn(
            "font-display text-[22px] leading-none tracking-[0.02em]",
            isDark ? "text-background" : "text-primary-700"
          )}
        >
          Leadflux
        </span>
      </div>
      <span className={cn("text-[11px]", isDark ? "text-secondary-300" : "text-ink-500")}>
        {caption}
      </span>
    </div>
  );
}
