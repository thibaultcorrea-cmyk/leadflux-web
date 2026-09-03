"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalController } from "@/hooks/useModalController";
import { reportErrorClient } from "@/lib/report-error-client";
import { toast } from "@/lib/toaster";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

type ConfirmModalContentProps = {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "destructive";
  isLoading?: boolean;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  onConfirm?: () => Promise<unknown>;
  onCancel?: () => Promise<void>;
  messages?: ConfirmActionMessages;
};

type ConfirmMessage = { title: string, description: string };

/**
 * `success` peut dependre du resultat de `onConfirm` (ex. nombre de
 * brouillons rediges) : le resoudre en fonction evite de figer le message
 * avant que l'action ait tourne (cf. dialogMessages.drafting).
 */
export type ConfirmActionMessages = {
  success: ConfirmMessage | ((result: unknown) => ConfirmMessage);
  error: ConfirmMessage;
}

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
  onCancel,
  messages,
}: ConfirmModalContentProps) {
  const { close } = useModalController();
  const [isPending, startTransition] = useTransition();

  const confirmLabelText = isLoading ? "Traitement en cours ..." : confirmLabel;
  const handleCancel = async () => {
    await onCancel?.();
    if (closeOnCancel) close();
  }

  const handleConfirm = async () => {
    startTransition(async () => {
      try {
        const result = await onConfirm?.();
        if (messages?.success) {
          const { title, description } =
            typeof messages.success === "function"
              ? messages.success(result)
              : messages.success;
          toast.success({
            title,
            description,
          });
        }
      } catch (error) {
        reportErrorClient(error as Error, "Error on confirm modal")
        if (messages?.error) {
          const { title, description } = messages.error;
          toast.error({
            title,
            description,
          });
        }
      } finally {
        if (closeOnConfirm) close();
      }
    });
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
          disabled={isLoading || isPending}
        >
          {isLoading || isPending && <Loader2 className="animate-spin" />}
          {confirmLabelText}
        </Button>
      </DialogFooter>
    </>
  );
}
