"use client";

import { BookOpen, Image as ImageIcon, TriangleAlert } from "lucide-react";

import { useScrollSpy } from "../hooks/useScrollSpy";
import { knowledgeBaseMock } from "../services/knowledge-base-mock";
import type { AdminSection } from "../types/section";
import { AdminSectionsNav } from "./nav/AdminSectionsNav";
import { AdminSectionShell } from "./sections/AdminSectionShell";
import { KnowledgeBaseFormattingHelp } from "./sections/knowledge-base/components/KnowledgeBaseFormattingHelp";
import { KnowledgeBaseSection } from "./sections/knowledge-base/components/KnowledgeBaseSection";
import { KnowledgeBaseVersionBar } from "./sections/knowledge-base/components/KnowledgeBaseVersionBar";
import { LogoSection } from "./sections/logo/components/LogoSection";

const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: "base-de-connaissances",
    label: "Base de connaissances",
    shortLabel: "Base",
    icon: BookOpen,
    description:
      "Le document que Leadflux lit en entier avant de rédiger chaque email. Une seule base, en texte, remplacée à chaque nouvelle version.",
  },
  {
    id: "logo-de-lentreprise",
    label: "Logo de l'entreprise",
    shortLabel: "Logo",
    icon: ImageIcon,
    description:
      "Affiché dans la barre latérale et dans la signature des emails envoyés. Servi en PNG aux clients mail, quel que soit le format importé.",
  },
  {
    id: "zone-sensible",
    label: "Zone sensible",
    shortLabel: "Sensible",
    icon: TriangleAlert,
    description:
      "Actions irréversibles, réservées aux administrateurs. Aucune sauvegarde automatique n'existe côté serveur : exportez avant d'agir.",
  },
];

const ADMIN_SECTION_IDS = ADMIN_SECTIONS.map((section) => section.id);

/**
 * Compose la nav d'ancrage et les sections de la page Configurations
 * (maquette "Variante A — Page à sections + ancres"). Seul point du dossier
 * qui connaît la liste des sections : la nav et le hook de scroll-spy
 * restent génériques et reçoivent tout en props. La section "Utilisateurs"
 * a été déplacée sur sa propre page (`/administration/utilisateurs`) : elle
 * n'apparaît plus ici.
 */
export function AdminSectionsLayout() {
  const activeId = useScrollSpy(ADMIN_SECTION_IDS);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-7">
      <AdminSectionsNav sections={ADMIN_SECTIONS} activeId={activeId} />
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        {ADMIN_SECTIONS.map((section) => (
          <AdminSectionShell
            key={section.id}
            id={section.id}
            title={section.label}
            description={section.description}
            headerAction={
              section.id === "base-de-connaissances" ? (
                <KnowledgeBaseVersionBar version={knowledgeBaseMock.getCurrentVersion()} />
              ) : undefined
            }
          >
            {section.id === "base-de-connaissances" && (
              <>
                <KnowledgeBaseSection />
                <KnowledgeBaseFormattingHelp />
              </>
            )}
            {section.id === "logo-de-lentreprise" && <LogoSection />}
          </AdminSectionShell>
        ))}
      </div>
    </div>
  );
}
