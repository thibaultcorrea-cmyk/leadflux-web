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
 * Nav d'ancrage sticky, purement présentationnelle : elle affiche la section
 * active reçue en prop et déclenche le scroll au clic, sans jamais calculer
 * elle-même quelle section est visible (cf. useScrollSpy).
 */
export function AdminSectionsNav({ sections, activeId }: AdminSectionsNavProps) {
  return (
    <nav
      aria-label="Sur cette page"
      className="sticky top-6 flex w-[204px] shrink-0 flex-col gap-1"
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
              "flex items-center gap-2.5 rounded-md border-l-2 px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "border-accent-500 bg-primary-50 text-primary-700"
                : "border-transparent text-ink-500 hover:bg-primary-50/60 hover:text-primary-700"
            )}
          >
            <Icon className={cn("size-4", isActive ? "text-primary-700" : "text-ink-500")} aria-hidden />
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
