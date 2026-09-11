"use client";

import { useEffect, useState } from "react";

type UseScrollSpyOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * Observe une liste d'ids de sections et retourne celui actuellement visible
 * en haut de la zone de lecture. N'a aucune connaissance des libellés, icônes
 * ou du rendu : uniquement responsable de la détection de section active.
 */
export function useScrollSpy(
  sectionIds: string[],
  { rootMargin = "-15% 0px -70% 0px", threshold = 0 }: UseScrollSpyOptions = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        }

        const firstVisibleId = sectionIds.find((id) => visibleIds.has(id));
        if (firstVisibleId) setActiveId(firstVisibleId);
      },
      { rootMargin, threshold }
    );

    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [sectionIds, rootMargin, threshold]);

  return activeId;
}
