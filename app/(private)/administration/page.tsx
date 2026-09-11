import { SidebarTrigger } from "@/components/ui/sidebar";

// TODO: implémenter la redirection des non-admin (rôle "client") vers /tableau.
// Le layout (private) ne vérifie aujourd'hui que la présence d'une session,
// pas le rôle admin/client (cf. CLAUDE.md §5) — cette page est donc accessible
// à tout utilisateur connecté tant que ce contrôle n'est pas ajouté.
export default function AdministrationPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="font-display text-[42px] leading-none tracking-[0.02em] text-primary-700">
              Administration
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Gestion des comptes et des paramètres réservés aux administrateurs
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}
