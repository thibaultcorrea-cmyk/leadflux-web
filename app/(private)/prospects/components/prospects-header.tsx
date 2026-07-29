import { NewSearchButton } from "@/components/shared/Buttons/NewSearchButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ExportButton } from "./export-button";

/** En-tête de la page de résultats : titre, contexte du sourcing et actions d'écran. */
export function ProspectsHeader({ subtitle }: { subtitle: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Seul point d'entrée de la nav quand la sidebar est repliée ou en mobile. */}
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="font-display text-[42px] leading-none tracking-[0.02em] text-primary-700">
            Recherche de prospects
          </h1>
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ExportButton />
        <NewSearchButton />
      </div>
    </header>
  );
}
