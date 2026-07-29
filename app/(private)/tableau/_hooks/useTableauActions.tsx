"use client"

import { useModalController } from "@/hooks/useModalController"

export const useTableauActions = () => {

    const controller = useModalController()

    const openNewSearchModal = () => {
        controller.open(<h1>hello</h1>)
    }


    return {
        openNewSearchModal
    }
}