"use client"

import { useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { modalContext, ModalContextType } from "./ModalContext"
import { cn } from "@/lib/utils"





export const ModalProvider = ({ children }: { children: React.ReactNode }) => {

    const [state, setState] = useState<Omit<ModalContextType, "setState">>({
        isOpen: false,
        disablePointerDismissal: false,
        components: null,
        contentClassName: undefined,
        payload: undefined,

    })

    const setModalState: ModalContextType["setState"] = (newState) => {
        setState((prev) => ({
            ...prev,
            ...(newState || {}),
        }))
    }

    const Provider = modalContext.Provider


    const closeModal = (open: boolean) => {
        if (!open) {
            setModalState({
                isOpen: false,
                components: null,
                contentClassName: undefined,
                payload: undefined,
            })
        }

    }


    return <Provider value={{ ...state, setState: setModalState }}>
        <Dialog disablePointerDismissal={state.disablePointerDismissal} open={state.isOpen} onOpenChange={closeModal}  >
            {children}

            <DialogContent className={cn("w-fit", state.contentClassName)}>
                {state.components}
            </DialogContent>
        </Dialog>
    </Provider>
}




