"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalController } from "@/hooks/useModalController";
import { Loader2 } from "lucide-react";

type ConfirmModalContentProps = {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "destructive";
  isLoading?: boolean;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  onConfirm?: () => Promise<void>;
  onCancel?: () => Promise<void>;
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
  isLoading = false,
  closeOnConfirm = true,
  closeOnCancel = true,
  onConfirm,
  onCancel
}: ConfirmModalContentProps) {
  const { close } = useModalController();

  const confirmLabelText = isLoading ? "Traitement en cours ..." : confirmLabel;
  const handleCancel = async () => {
    await onCancel?.();
    if (closeOnCancel) close();
  }

  const handleConfirm = async () => {
    await onConfirm?.();
    if (closeOnConfirm) close();
  }

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
        <Button type="button" variant="outline" size="lg" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="lg"
          variant={tone === "destructive" ? "destructive" : "default"}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {confirmLabelText}
        </Button>
      </DialogFooter>
    </>
  );
}
