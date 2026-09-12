"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropDown from "./UserDropDown";
import { Button } from "@/components/ui/button";
import { BrandIcon } from "./BrandIcon";

export type AppSidebarSubNavItem = {
  label: string;
  href: string;
};

export type AppSidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Sous-entrées affichées en accordéon sous cet item (ex. Administration). */
  items?: AppSidebarSubNavItem[];
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

function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNavLink({ item, pathname }: { item: AppSidebarNavItem; pathname: string }) {
  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.label}
        className="h-9 gap-2.5 px-3 text-secondary-100 data-active:text-sidebar-foreground"
        render={<Link href={item.href} aria-current={isActive ? "page" : undefined} />}
      >
        <Icon className={isActive ? "text-accent-500" : "text-secondary-300"} aria-hidden />
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Item de nav avec sous-entrées (ex. Administration > Configurations,
 * Utilisateurs, Historiques). La ligne principale reste un lien classique
 * (mène à la première sous-page) ; le chevron, cible séparée, ouvre/ferme
 * l'accordéon — deux comportements, deux contrôles, plutôt qu'un clic
 * ambigu sur toute la ligne.
 */
function SidebarNavCollapsible({ item, pathname }: { item: AppSidebarNavItem; pathname: string }) {
  const Icon = item.icon;
  const subItems = item.items ?? [];
  const isChildActive = subItems.some((sub) => isNavItemActive(pathname, sub.href));
  const isActive = isChildActive || isNavItemActive(pathname, item.href);
  const [open, setOpen] = useState(isActive);
  const [trackedActive, setTrackedActive] = useState(isActive);

  // Développe automatiquement la section quand on navigue vers l'une de ses
  // sous-pages (ex. lien direct, retour arrière) ; ne la referme jamais
  // toute seule pour respecter un repli manuel de l'utilisateur. Calculé
  // pendant le rendu plutôt que dans un effet, pour éviter un rendu en
  // cascade (cf. règle React `set-state-in-effect`).
  if (isActive !== trackedActive) {
    setTrackedActive(isActive);
    if (isActive) setOpen(true);
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          tooltip={item.label}
          className="h-9 gap-2.5 px-3 text-secondary-100 data-active:text-sidebar-foreground"
          render={<Link href={item.href} aria-current={isActive ? "page" : undefined} />}
        >
          <Icon className={isActive ? "text-accent-500" : "text-secondary-300"} aria-hidden />
          <span>{item.label}</span>
        </SidebarMenuButton>
        <CollapsibleTrigger
          render={
            <SidebarMenuAction
              className="group/nav-toggle text-secondary-300 hover:text-sidebar-foreground"
              aria-label={open ? `Réduire ${item.label}` : `Développer ${item.label}`}
            />
          }
        >
          <ChevronDown
            className="size-4 transition-transform duration-200 group-data-panel-open/nav-toggle:rotate-180"
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((sub) => {
              const isSubActive = isNavItemActive(pathname, sub.href);

              return (
                <SidebarMenuSubItem key={sub.href}>
                  <SidebarMenuSubButton
                    isActive={isSubActive}
                    render={
                      <Link href={sub.href} aria-current={isSubActive ? "page" : undefined} />
                    }
                  >
                    <span>{sub.label}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/**
 * Barre latérale générique : rien de spécifique à un produit n'est codé ici.
 * L'appelant fournit sa marque, ses entrées de navigation et son utilisateur.
 * L'entrée active est déduite de l'URL, pas passée en prop, pour qu'aucune page
 * n'ait à se déclarer elle-même. Un item avec `items` se rend en accordéon
 * (cf. SidebarNavCollapsible) ; sans `items`, en lien simple.
 */
export function AppSidebar({ brand, navItems, user }: AppSidebarProps) {
  const pathname = usePathname();



  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-0 p-0">
        <div className="flex items-center justify-between gap-2 px-4 py-5 group-data-[collapsible=icon]:px-2 relative group-data-[collapsible=icon]:justify-center">
          <Link
            href={brand.href}
            className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <BrandIcon Icon={brand.icon} className="text-accent-500" aria-hidden />
            <span className="font-display text-[26px] leading-none tracking-[0.02em] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              {brand.label}
            </span>
          </Link>
          <SidebarTrigger className="size-7 shrink-0 rounded-full bg-sidebar-accent text-secondary-200 hover:bg-sidebar-accent hover:text-sidebar-foreground absolute right-0 translate-x-1/2 border border-accent group-data-[collapsible=icon]:hidden cursor-pointer"
            render={<Button>
              <ChevronLeft className="size-5 hover:text-accent-500" />
            </Button>}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarTrigger className="transition-all duration-500 ease-in-out mx-auto size-9 rounded-full bg-sidebar-accent text-secondary-200 hover:bg-sidebar-accent hover:text-sidebar-foreground  group-data-[collapsible=icon]:flex hidden group-data-[collapsible=icon]:animate-in fade-in-0 group-data-[collapsible=icon]:slide-in-from-left-100 cursor-pointer"
          render={<Button>
            <ChevronRight className="size-5 hover:text-accent-500" />
          </Button>}
        />
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) =>
                item.items?.length ? (
                  <SidebarNavCollapsible key={item.href} item={item} pathname={pathname} />
                ) : (
                  <SidebarNavLink key={item.href} item={item} pathname={pathname} />
                )
              )}
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
