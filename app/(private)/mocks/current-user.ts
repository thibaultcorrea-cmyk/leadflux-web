import type { AppSidebarUser } from "@/components/shared/sidebars/app-sidebar";

/**
 * Utilisateur affiché en pied de sidebar. Mocké tant que Better Auth n'est pas
 * branché (cf. CLAUDE.md §5) : à remplacer par la session côté serveur.
 */
export const currentUser: AppSidebarUser = {
  name: "Thibault Correa",
  role: "Admin",
  initials: "TC",
};
