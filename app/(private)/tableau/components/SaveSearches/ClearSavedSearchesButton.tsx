"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { reportErrorClient } from "@/lib/report-error-client";
import { toast } from "@/lib/toaster";
import { waitDelay } from "@/lib/utils";
import { useSavedSearchesMutation } from "../../_hooks/useSavedSearchesMutation";

export function ClearSavedSearchesButton() {
    const [isPending, startTransition] = useTransition();
    const { clear } = useSavedSearchesMutation();

    const clearSavedSearches = () => {
        startTransition(async () => {
            try {
                await waitDelay(1000);
                await clear();
                toast.success({
                    title: "Recherches effacées",
                    description: "Toutes les recherches enregistrées ont été supprimées.",
                });
            } catch (error) {
                reportErrorClient(error as Error, "Erreur lors de la suppression des recherches enregistrées");
                toast.error({
                    title: "Erreur",
                    description: "Impossible d'effacer les recherches enregistrées. Veuillez réessayer.",
                });
            }
        });
    };

    const label = isPending ? "Effacement..." : "Vider"

    return (
        <Button className="border-destructive text-destructive" variant="destructive" onClick={clearSavedSearches} disabled={isPending}>

            {isPending ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
                <Trash2 className="size-3.5" aria-hidden />
            )}
            {label}
        </Button>
    );
}
