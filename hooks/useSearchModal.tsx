"use client";

import { SearchCriteriaModalContent } from "@/components/shared/Modals/SearchCriteriaModalContent";
import { useModalController } from "./useModalController";

/**
 * Ouvre la modale de recherche. Partagé par le Tableau, la page de résultats et
 * le lien « Modifier les critères » : trois points d'entrée, une seule modale.
 */
export function useSearchModal() {
  const { open } = useModalController();

  const openSearchModal = () =>
    open({
      components: <SearchCriteriaModalContent />,
      disablePointerDismissal: true,
    });

  return { openSearchModal };
}
