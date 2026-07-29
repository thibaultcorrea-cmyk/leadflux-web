"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSearchModal } from "@/hooks/useSearchModal";
import { cn } from "@/lib/utils";

/**
 * Bouton « Nouvelle recherche ». Présent sur le Tableau comme sur la page de
 * résultats : il vit donc dans les composants partagés plutôt que dans une page.
 */
export function NewSearchButton({
  label = "Nouvelle recherche",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { openSearchModal } = useSearchModal();

  return (
    <Button
      type="button"
      size="lg"
      className={cn("h-11 gap-2 px-5 text-[15px]", className)}
      onClick={openSearchModal}
    >
      <Search className="size-[17px]" aria-hidden />
      {label}
    </Button>
  );
}
