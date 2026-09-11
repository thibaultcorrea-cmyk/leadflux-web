"use client";

import { LayoutDashboard, Mail, Radar, Settings, Users } from "lucide-react";

import {
  AppSidebar,
  AppSidebarUser,
  type AppSidebarNavItem,
} from "@/components/shared/sidebars/app-sidebar";
import { currentUser } from "../mocks/current-user";

/**
 * Configuration Leadflux de la sidebar générique.
 *
 * La navigation contient Tableau, Prospects, Emails et Administration : la
 * recherche est une action (modale), pas une destination, et l'onglet Analyse
 * a été supprimé (cf. CLAUDE.md §3).
 */
const NAV_ITEMS: AppSidebarNavItem[] = [
  { label: "Tableau", href: "/tableau", icon: LayoutDashboard },
  { label: "Prospects", href: "/prospects", icon: Users },
  { label: "Emails", href: "/emails", icon: Mail },
  // TODO: la route est visible dans la nav pour tout utilisateur connecté ;
  // implémenter la redirection des non-admin (rôle "client") hors de /administration.
  { label: "Administration", href: "/administration", icon: Settings },
];

export function PrivateSidebar({ currentUser }: { currentUser: AppSidebarUser }) {



  return (
    <AppSidebar
      brand={{ label: "Leadflux", icon: Radar, href: "/tableau" }}
      navItems={NAV_ITEMS}
      user={currentUser}
    />
  );
}
