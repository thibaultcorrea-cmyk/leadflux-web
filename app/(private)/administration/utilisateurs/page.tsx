import { SidebarTrigger } from "@/components/ui/sidebar";
import { InviteUserButton } from "./components/InviteUserButton";
import { UsersTableCard } from "./components/table/UsersTableCard";

// TODO: implémenter la redirection des non-admin (rôle "client") vers /tableau.
// Le layout (private) ne vérifie aujourd'hui que la présence d'une session,
// pas le rôle admin/client (cf. CLAUDE.md §5) — cette page est donc accessible
// à tout utilisateur connecté tant que ce contrôle n'est pas ajouté.
export default function UtilisateursPage() {
  return (
    <div className="flex min-h-svh flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="font-display text-[42px] leading-none tracking-[0.02em] text-primary-700">
              Utilisateurs
            </h1>
            <p className="mt-1 max-w-[62ch] text-sm text-ink-500">
              Deux rôles, admin et client. Aucune inscription publique : un compte n&apos;existe
              que si un administrateur l&apos;a invité ici.
            </p>
          </div>
        </div>
        <InviteUserButton />
      </header>

      <UsersTableCard />
    </div>
  );
}
