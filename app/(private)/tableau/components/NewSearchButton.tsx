"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useTableauActions } from "../_hooks/useTableauActions"

export const NewSearchButton = () => {

    const { openNewSearchModal } = useTableauActions()


    return <Button size="lg" className="h-11 gap-2 px-5 text-[15px]" onClick={openNewSearchModal}>
        <Search className="size-[17px]" aria-hidden />
        Nouvelle recherche
    </Button>
}