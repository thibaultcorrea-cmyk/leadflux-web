"use client";

import { BookOpen, Image as ImageIcon, TriangleAlert, Users } from "lucide-react";

import { useScrollSpy } from "../hooks/useScrollSpy";
import type { AdminSection } from "../types/section";
import { AdminSectionsNav } from "./nav/AdminSectionsNav";
import { AdminSectionShell } from "./sections/AdminSectionShell";

const ADMIN_SECTIONS: AdminSection[] = [
  { id: "base-de-connaissances", label: "Base de connaissances", shortLabel: "Base", icon: BookOpen },
  { id: "logo-de-lentreprise", label: "Logo de l'entreprise", shortLabel: "Logo", icon: ImageIcon },
  { id: "utilisateurs", label: "Utilisateurs", shortLabel: "Comptes", icon: Users },
  { id: "zone-sensible", label: "Zone sensible", shortLabel: "Sensible", icon: TriangleAlert },
];

const ADMIN_SECTION_IDS = ADMIN_SECTIONS.map((section) => section.id);

/**
 * Compose la nav d'ancrage et les sections de la page Administration
 * (maquette "Variante A — Page à sections + ancres"). Seul point du dossier
 * qui connaît la liste des sections : la nav et le hook de scroll-spy
 * restent génériques et reçoivent tout en props.
 */
export function AdminSectionsLayout() {
  const activeId = useScrollSpy(ADMIN_SECTION_IDS);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-7">
      <AdminSectionsNav sections={ADMIN_SECTIONS} activeId={activeId} />
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        {ADMIN_SECTIONS.map((section) => (
          <AdminSectionShell key={section.id} id={section.id} title={section.label} />
        ))}
      </div>
    </div>
  );
}
