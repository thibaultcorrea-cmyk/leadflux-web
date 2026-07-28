import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivateSidebar } from "./components/private-sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthProvider } from "./components/AuthProvider";
import { headers } from "next/headers";
import { AppSidebarUser } from "@/components/shared/sidebars/app-sidebar";
import { showUserInitials, showUserRoleLabel } from "@/lib/user-session";

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

  const currentUser = {
    name: session.user.name,
    role: showUserRoleLabel(session.user),
    initials: showUserInitials(session.user.name),
  } satisfies AppSidebarUser;


  return (
    <AuthProvider session={session}>
      <TooltipProvider>
        <SidebarProvider>
          <PrivateSidebar currentUser={currentUser} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}
