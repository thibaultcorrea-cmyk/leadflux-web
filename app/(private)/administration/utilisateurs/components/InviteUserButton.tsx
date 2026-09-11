"use client";

import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Action d'en-tête de la section Utilisateurs (maquette "Btn Inviter un
 * utilisateur"). Sans effet pour l'instant : aucune modale d'invitation
 * n'est encore conçue dans la maquette.
 */
export function InviteUserButton() {
  return (
    <Button type="button" size="lg" className="h-10 gap-2 px-4 text-sm font-semibold">
      <UserPlus className="size-[15px]" aria-hidden />
      Inviter un utilisateur
    </Button>
  );
}
