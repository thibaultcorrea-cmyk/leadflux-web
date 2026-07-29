"use client";

import { Button } from "@/components/ui/button";
import {
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
  const { close } = useModalController();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl tracking-[0.02em] text-primary-700">
          Nouvelle recherche
        </DialogTitle>
        <DialogDescription className="text-sm text-ink-700">
          Le formulaire des cinq critères (secteur, localisation, poste, taille,
          chiffre d&apos;affaires) arrive dans le prochain lot.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button type="button" variant="outline" size="lg" onClick={close}>
          Fermer
        </Button>
      </DialogFooter>
    </>
  );
}
