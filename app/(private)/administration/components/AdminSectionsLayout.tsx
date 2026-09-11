"use client";

import { BookOpen, Image as ImageIcon, TriangleAlert, Users } from "lucide-react";

import { useScrollSpy } from "../hooks/useScrollSpy";
import { knowledgeBaseMock } from "../services/knowledge-base-mock";
import type { AdminSection } from "../types/section";
import { AdminSectionsNav } from "./nav/AdminSectionsNav";
import { AdminSectionShell } from "./sections/AdminSectionShell";
import { KnowledgeBaseFormattingHelp } from "./sections/knowledge-base/KnowledgeBaseFormattingHelp";
import { KnowledgeBaseSection } from "./sections/knowledge-base/KnowledgeBaseSection";
import { KnowledgeBaseVersionBar } from "./sections/knowledge-base/KnowledgeBaseVersionBar";
import { LogoSection } from "./sections/logo/LogoSection";

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
    id: "utilisateurs",
    label: "Utilisateurs",
    shortLabel: "Comptes",
    icon: Users,
    description:
      "Deux rôles, admin et client. Aucune inscription publique : un compte n'existe que si un administrateur l'a invité ici.",
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
 * Compose la nav d'ancrage et les sections de la page Administration
 * (maquette "Variante A — Page à sections + ancres"). Seul point du dossier
 * qui connaît la liste des sections : la nav et le hook de scroll-spy
 * restent génériques et reçoivent tout en props. Pour l'instant, "Base de
 * connaissances" et "Logo de l'entreprise" ont un contenu réel ; les autres
 * sont traitées une par une.
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
