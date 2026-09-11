import { History } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SidebarTrigger } from "@/components/ui/sidebar";

// TODO: implémenter la redirection des non-admin (rôle "client") vers /tableau.
// Le layout (private) ne vérifie aujourd'hui que la présence d'une session,
// pas le rôle admin/client (cf. CLAUDE.md §5) — cette page est donc accessible
// à tout utilisateur connecté tant que ce contrôle n'est pas ajouté.
//
// Contenu pas encore défini côté maquette (cf. CLAUDE.md §9, ordre de
// construction) : cette page ne fait pour l'instant que tenir la place dans
// la sous-navigation Administration.
export default function HistoriquesPage() {
  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 lg:p-8">
      <header className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="font-display text-[42px] leading-none tracking-[0.02em] text-primary-700">
            Historiques
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Journal des actions d&apos;administration. Réservé aux administrateurs.
          </p>
        </div>
      </header>

      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <History aria-hidden />
          </EmptyMedia>
          <EmptyTitle>Aucun historique pour l&apos;instant</EmptyTitle>
          <EmptyDescription>
            Cet écran affichera le journal des actions d&apos;administration (configurations,
            comptes) une fois cette fonctionnalité conçue.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
