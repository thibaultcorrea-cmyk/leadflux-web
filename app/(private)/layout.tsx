import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivateSidebar } from "./components/private-sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthProvider } from "./components/AuthProvider";
import { headers } from "next/headers";

/**
 * Layout de l'espace connecté : sidebar persistante + zone de contenu.
 * Toute page sous (private) hérite de cette navigation.
 */
export default async function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect("/");


  return (
    <AuthProvider session={session}>
      <TooltipProvider>
        <SidebarProvider>
          <PrivateSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}
