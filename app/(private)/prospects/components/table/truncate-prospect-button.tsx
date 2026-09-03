
"use client"

import { Button } from "@/components/ui/button"
import { waitDelay } from "@/lib/utils"
import { Loader2, Trash } from "lucide-react"
import { useTransition } from "react"
import { useProspectMutation } from "../../_hooks/useProspectMutation"
import { toast } from "@/lib/toaster"
import { dialogMessages } from "../../services/dialog-messages"
import { reportErrorClient } from "@/lib/report-error-client"

export function TruncateProspectButton() {

    const [isPending, startTransition] = useTransition()

    const { truncate } = useProspectMutation()

    const truncateProspect = () => {
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
    const label = isPending ? "Vidage en cours..." : "Vider"

    return (
        <div>
            <Button className="border-destructive text-destructive" variant="destructive" onClick={truncateProspect} disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash className="size-4" />}
                <span className="text-xs">{label}</span>
            </Button>
        </div>
    )
}