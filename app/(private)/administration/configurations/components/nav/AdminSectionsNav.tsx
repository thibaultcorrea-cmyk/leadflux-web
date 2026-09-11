"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { AdminSection } from "../../types/section";

type AdminSectionsNavProps = {
  sections: AdminSection[];
  activeId: string | null;
};

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

/**
 * Nav d'ancrage, purement présentationnelle : elle affiche la section active
 * reçue en prop et déclenche le scroll au clic, sans jamais calculer
 * elle-même quelle section est visible (cf. useScrollSpy). Deux variantes
 * pour un même contenu — barre horizontale sticky en haut sous 768px, colonne
 * verticale sticky au-delà — cf. maquette "Administration — Mobile 375
 * (Ancres sticky)" et "Variante A (Page à sections + ancres)".
 */
export function AdminSectionsNav({ sections, activeId }: AdminSectionsNavProps) {
  return (
    <>
      <nav
        aria-label="Sur cette page"
        className="sticky top-0 z-10 flex items-end gap-0.5 overflow-x-auto border-b border-border bg-card shadow-sm md:hidden"
      >
        {sections.map((section) => {
          const isActive = section.id === activeId;
          const Icon = section.icon;

          return (
            <Link
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(section.id);
              }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 pt-2.5 pb-2 text-xs whitespace-nowrap transition-colors",
                isActive
                  ? "border-accent-500 font-semibold text-ink-900"
                  : "border-transparent font-medium text-ink-500"
              )}
            >
              <Icon className={cn("size-3.5", isActive ? "text-primary-700" : "text-ink-500")} aria-hidden />
              {section.shortLabel}
            </Link>
          );
        })}
      </nav>

      <nav
        aria-label="Sur cette page"
        className="sticky top-6 hidden w-56 shrink-0 flex-col gap-1 md:flex"
      >
        <span className="px-3 pb-1 text-[11px] font-semibold tracking-[0.08em] text-ink-500">
          SUR CETTE PAGE
        </span>
        {sections.map((section) => {
          const isActive = section.id === activeId;
          const Icon = section.icon;

          return (
            <Link
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(section.id);
              }}
              className={cn(
                "flex items-center gap-2.5 rounded-md border-l-2 px-3 py-2.25 text-[13px] transition-colors",
                isActive
                  ? "border-accent-500 bg-background-200 font-semibold text-ink-900"
                  : "border-transparent font-medium text-ink-700 hover:bg-background-100"
              )}
            >
              <Icon className={cn("size-4", isActive ? "text-primary-700" : "text-ink-500")} aria-hidden />
              {section.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
