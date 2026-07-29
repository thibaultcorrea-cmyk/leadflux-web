"use client";

import { Download } from "lucide-react";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import { Button } from "@/components/ui/button";
import { useModalController } from "@/hooks/useModalController";

/** Export des résultats. Le format (CSV) et la génération restent à brancher. */
export function ExportButton() {
  const { open } = useModalController();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-11 gap-2 px-4 text-[15px]"
      onClick={() =>
        open({
          components: (
            <ConfirmModalContent
              title="Exporter les résultats"
              description="L'export CSV des résultats de sourcing arrive dans un prochain lot."
              confirmLabel="Compris"
            />
          ),
        })
      }
    >
      <Download className="size-4" aria-hidden />
      Exporter
    </Button>
  );
}
