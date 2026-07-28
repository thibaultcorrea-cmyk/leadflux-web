"use client";

import { LayoutDashboard, Mail, Radar, Users } from "lucide-react";

import {
  AppSidebar,
  type AppSidebarNavItem,
} from "@/components/shared/sidebars/app-sidebar";
import { currentUser } from "../mocks/current-user";

/**
 * Configuration Leadflux de la sidebar générique.
 *
 * La navigation ne contient que Tableau, Prospects et Emails : la recherche est
 * une action (modale), pas une destination, et l'onglet Analyse a été supprimé
 * (cf. CLAUDE.md §3).
 */
const NAV_ITEMS: AppSidebarNavItem[] = [
  { label: "Tableau", href: "/tableau", icon: LayoutDashboard },
  { label: "Prospects", href: "/prospects", icon: Users },
  { label: "Emails", href: "/emails", icon: Mail },
];

export function PrivateSidebar() {
  return (
    <AppSidebar
      brand={{ label: "Leadflux", icon: Radar, href: "/tableau" }}
      navItems={NAV_ITEMS}
      user={currentUser}
    />
  );
}
