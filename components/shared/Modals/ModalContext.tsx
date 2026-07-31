"use client"

import { createContext, useContext, useState } from "react"

export interface ModalContextType {
    isOpen: boolean
    disablePointerDismissal?: boolean
    components?: React.ReactNode
    /** Classe appliquée au conteneur de la modale : sert à en régler la largeur. */
    contentClassName?: string
    payload?: unknown
    setState?: (state: Partial<ModalContextType>) => void
}

export const modalContext = createContext<ModalContextType>({
    isOpen: false,
    disablePointerDismissal: false,
    components: null,
    contentClassName: undefined,
    payload: undefined,
    setState: () => { }
})




