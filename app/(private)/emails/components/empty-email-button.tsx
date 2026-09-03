"use client"

import { Button } from "@/components/ui/button";
import { reportErrorClient } from "@/lib/report-error-client";
import { toast } from "@/lib/toaster";
import { waitDelay } from "@/lib/utils";
import { Loader2, Trash } from "lucide-react";
import { useTransition } from "react";
import { dialogMessages } from "../services/dialog-messages";
import { useEmailMutation } from "../_hooks/useEmailMutation";

export const EmptyEmailButton = () => {
    const [isPending, startTransition] = useTransition()
    const label = isPending ? "Vidage en cours..." : "Vider"
    const { truncate } = useEmailMutation();

    const truncateEmail = () => {
        startTransition(async () => {
            try {
                await waitDelay(2000)
                await truncate()
                toast.success(dialogMessages.truncate.success)
            } catch (error) {
                reportErrorClient(error as Error, "Erreur lors du vidage des prospects")
                toast.error(dialogMessages.truncate.error)
            }
        })
    }

    return (
        <Button className="border-destructive text-destructive" variant="destructive" onClick={truncateEmail} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash className="size-4" />}
            <span className="text-xs">{label}</span>
        </Button>

    );
};

