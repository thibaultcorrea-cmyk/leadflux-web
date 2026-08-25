
"use client"

import { Button } from "@/components/ui/button"
import { waitDelay } from "@/lib/utils"
import { Loader2, Trash } from "lucide-react"
import { useTransition } from "react"

export function TruncateProspectButton() {

    const [isPending, startTransition] = useTransition()

    const truncateProspect = () => {
        startTransition(async () => {
            try {
                await waitDelay(1000)
            } catch (error) {
                console.log(error)
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