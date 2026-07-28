import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivateSidebar } from "./components/private-sidebar";

/**
 * Layout de l'espace connecté : sidebar persistante + zone de contenu.
 * Toute page sous (private) hérite de cette navigation.
 */
export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <PrivateSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
