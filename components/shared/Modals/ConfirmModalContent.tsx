"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalController } from "@/hooks/useModalController";

type ConfirmModalContentProps = {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "destructive";
  onConfirm?: () => void;
};

/**
 * Contenu de modale de confirmation, à passer à `useModalController().open()`.
 *
 * Toute action destructive ou groupée passe par là : la confirmation est le
 * garde-fou du produit, pas une politesse d'interface.
 */
export function ConfirmModalContent({
  title,
  description,
  confirmLabel,
  cancelLabel = "Annuler",
  tone = "default",
  onConfirm,
}: ConfirmModalContentProps) {
  const { close } = useModalController();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl tracking-[0.02em] text-primary-700">
          {title}
        </DialogTitle>
        <DialogDescription className="text-sm text-ink-700">
          {description}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button type="button" variant="outline" size="lg" onClick={close}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="lg"
          variant={tone === "destructive" ? "destructive" : "default"}
          onClick={() => {
            onConfirm?.();
            close();
          }}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </>
  );
}
