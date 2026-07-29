"use client"

import { createContext, useContext, useState } from "react"

export interface ModalContextType {
    isOpen: boolean
    disablePointerDismissal?: boolean
    components?: React.ReactNode
    payload?: unknown
    setState?: (state: Partial<ModalContextType>) => void
}

export const modalContext = createContext<ModalContextType>({
    isOpen: false,
    disablePointerDismissal: false,
    components: null,
    payload: undefined,
    setState: () => { }
})




