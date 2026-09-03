"use client";

import { SearchProspectForm } from "@/app/(private)/prospects/components/forms/SearchProspectForm";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalController } from "@/hooks/useModalController";

/**
 * Modale de recherche : la recherche est une action, pas une destination
 * (CLAUDE.md §3), donc le formulaire des cinq critères vit ici et non dans un
 * onglet.
 *
 * Le formulaire lui-même (secteur, localisation, poste, taille, chiffre
 * d'affaires) reste à construire ; ce contenu tient la place et la mécanique
 * d'ouverture depuis le Tableau, la page de résultats et la barre de critères.
 */
export function SearchCriteriaModalContent() {
  const { payload } = useModalController();

  const redirectValue = (payload as { redirect: boolean })?.redirect || false;

  return (
    <>


      <SearchProspectForm redirect={redirectValue} />


    </>
  );
}
