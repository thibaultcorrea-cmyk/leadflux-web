"use client"

import { useModalController } from "@/hooks/useModalController"

export const useTableauActions = () => {

    const controller = useModalController()

    const openNewSearchModal = () => {
        controller.open({ components: <h1>hello</h1>, disablePointerDismissal: true })
    }


    return {
        openNewSearchModal
    }
}