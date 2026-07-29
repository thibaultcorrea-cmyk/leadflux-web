"use client"

import { createContext, useContext, useState } from "react"

export interface ModalContextType {
    isOpen: boolean
    components?: React.ReactNode
    payload?: unknown
    setState?: (state: Partial<ModalContextType>) => void
}

export const modalContext = createContext<ModalContextType>({
    isOpen: false,
    components: null,
    payload: undefined,
    setState: () => { }
})




export const ModalProvider = ({ children }: { children: React.ReactNode }) => {

    const [state, setState] = useState<Omit<ModalContextType, "setState">>({
        isOpen: false,
        components: null,
        payload: undefined,

    })

    const setModalState: ModalContextType["setState"] = (newState) => {
        setState((prev) => ({
            ...prev,
            ...(newState || {}),
        }))
    }

    const Provider = modalContext.Provider

    return <Provider value={{ ...state, setState: setModalState }}>{children}</Provider>
}