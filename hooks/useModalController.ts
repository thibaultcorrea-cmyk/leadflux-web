"use client"

import { modalContext, ModalContextType } from "@/components/shared/Modals/ModalContext"
import { useContext } from "react"

export const useModalController = () => {
    const { isOpen, payload, setState } = useContext(modalContext)

    const open = ({ components, payload, disablePointerDismissal }: {
        components: ModalContextType["components"],
        payload?: ModalContextType["payload"],
        disablePointerDismissal?: boolean
    }

    ) => {
        setState?.({
            isOpen: true,
            components,
            payload,
            disablePointerDismissal
        })
    }

    const close = () => {
        setState?.({
            isOpen: false,
            disablePointerDismissal: false,
        })
        setTimeout(() => {
            setState?.({
                components: null,
                payload: undefined
            })
        }, 1000)

    }

    return {
        isOpen,
        payload,
        open,
        close
    }
}