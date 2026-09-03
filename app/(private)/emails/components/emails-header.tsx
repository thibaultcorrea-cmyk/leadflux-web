import { SidebarTrigger } from "@/components/ui/sidebar";
import { ExportEmailsButton } from "./export-emails-button";

/**
 * En-tête de l'onglet Emails. Le sous-titre rappelle la règle du produit :
 * rien ne part sans validation humaine.
 */
export function EmailsHeader({ total }: { total: number }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Seul point d'entrée de la nav quand la sidebar est repliée ou en mobile. */}
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="font-display text-[42px] leading-none tracking-[0.02em] text-primary-700">
            Emails
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {total} emails suivis par statut. Aucun envoi sans votre validation
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ExportEmailsButton />

      </div>
    </header>
  );
}
