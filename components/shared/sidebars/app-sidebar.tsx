"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropDown from "./UserDropDown";

export type AppSidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type AppSidebarUser = {
  name: string;
  role: string;
  initials: string;
};

export type AppSidebarBrand = {
  label: string;
  icon: LucideIcon;
  href: string;
};

type AppSidebarProps = {
  brand: AppSidebarBrand;
  navItems: AppSidebarNavItem[];
  user: AppSidebarUser;
};

/**
 * Barre latérale générique : rien de spécifique à un produit n'est codé ici.
 * L'appelant fournit sa marque, ses entrées de navigation et son utilisateur.
 * L'entrée active est déduite de l'URL, pas passée en prop, pour qu'aucune page
 * n'ait à se déclarer elle-même.
 */
export function AppSidebar({ brand, navItems, user }: AppSidebarProps) {
  const pathname = usePathname();
  const BrandIcon = brand.icon;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-0 p-0">
        <div className="flex items-center justify-between gap-2 px-4 py-5 group-data-[collapsible=icon]:px-2">
          <Link
            href={brand.href}
            className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent">
              <BrandIcon className="size-[17px] text-accent-500" aria-hidden />
            </span>
            <span className="font-display text-[26px] leading-none tracking-[0.02em] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {brand.label}
            </span>
          </Link>
          <SidebarTrigger className="size-7 shrink-0 rounded-md bg-sidebar-accent text-secondary-200 hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className="h-9 gap-2.5 px-3 text-secondary-100 data-active:text-sidebar-foreground"
                      render={
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                        />
                      }
                    >
                      <Icon
                        className={
                          isActive ? "text-accent-500" : "text-secondary-300"
                        }
                        aria-hidden
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <UserDropDown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
