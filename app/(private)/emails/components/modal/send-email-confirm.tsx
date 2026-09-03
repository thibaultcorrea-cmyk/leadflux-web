"use client"


import { ConfirmActionMessages } from "@/components/shared/Modals/ConfirmModalContent";
import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModalController } from "@/hooks/useModalController";
import { toast } from "@/lib/toaster";
import { Loader2 } from "lucide-react";
import { useRef, useTransition } from "react";

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
    messages?: ConfirmActionMessages
};

/**
 * Contenu de modale de confirmation, à passer à `useModalController().open()`.
 *
 * Toute action destructive ou groupée passe par là : la confirmation est le
 * garde-fou du produit, pas une politesse d'interface.
 */
export function SendEmailConfirmModalContent({
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
    messages
}: ConfirmModalContentProps) {
    const { close } = useModalController();

    const [isPending, startTransition] = useTransition()
    const confirmLabelText = isPending ? "Traitement en cours ..." : confirmLabel;
    const abortControllerRef = useRef<AbortController | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const promise = new Promise((resolve) => {
        timerRef.current = setTimeout(() => {
            resolve(true);
        }, 3000);
    })

    const handleConfirm = async () => {
        startTransition(async () => {
            try {
                await promise
                const result = await onConfirm?.();
                if (closeOnConfirm) close();
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
                if (messages?.error) {
                    const { title, description } = messages.error;
                    toast.error({
                        title,
                        description,

                    })
                }
            }

        })

    }

    const handleCancel = async () => {
        abortControllerRef.current?.abort();
        await onCancel?.();
        if (closeOnCancel) close();

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
                    disabled={isPending}
                >
                    {isPending && <Loader2 className="animate-spin" />}
                    {confirmLabelText}
                </Button>
            </DialogFooter>
        </>
    );
}
