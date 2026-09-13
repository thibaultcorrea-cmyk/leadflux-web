"use client"

import { Button } from "@/components/ui/button"
import { reportErrorClient } from "@/lib/report-error-client"
import { toast } from "@/lib/toaster"
import { cn, waitDelay } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"
import { useTransition } from "react"
import { fetchScanReply } from "./api-services"

export const RefreshButton = () => {
    const [isPending, startTransition] = useTransition()
    const queryClient = useQueryClient()
    const refresh = () => {
        startTransition(async () => {
            try {
                await fetchScanReply()
                await waitDelay(3500)
                await queryClient.invalidateQueries()
                toast.success({
                    title: "Tableau rafraîchi",
                    description: "Les données ont été rafraîchies avec succès",
                })
            } catch (error) {
                reportErrorClient(error as Error, 'refresh error')
                toast.error({
                    title: "Erreur",
                    description: "Impossible de rafraîchir le tableau",
                })
            }

        })
    }

    return (
        <Button disabled={isPending} variant="ghost" onClick={refresh}>
            <RefreshCw className={cn("size-4", { "animate-spin": isPending })} />
            Rafraîchir
        </Button>
    )
}