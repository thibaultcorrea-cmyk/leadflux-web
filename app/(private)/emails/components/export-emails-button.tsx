"use client";

import { Download } from "lucide-react";

import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import { Button } from "@/components/ui/button";
import { useModalController } from "@/hooks/useModalController";

/** Export du suivi des emails. Le format (CSV) et la génération restent à brancher. */
export function ExportEmailsButton() {
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
              title="Exporter le suivi"
              description="L'export CSV du suivi des emails arrive dans un prochain lot."
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
