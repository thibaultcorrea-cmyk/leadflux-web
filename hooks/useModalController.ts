"use client"

import { modalContext, ModalContextType } from "@/components/shared/Modals/ModalContext"
import { useContext } from "react"

export const useModalController = () => {
    const { isOpen, payload, setState } = useContext(modalContext)

    const open = (
        components: ModalContextType["components"],
        payload?: ModalContextType["payload"]
    ) => {
        setState?.({
            isOpen: true,
            components,
            payload
        })
    }

    const close = () => {
        setState?.({
            isOpen: false,


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