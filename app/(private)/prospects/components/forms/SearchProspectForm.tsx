"use client"

import { useSearchProspectForm } from "../../_hooks/useSearchProspectForm"
import {
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchFormInputs } from "./SearchFormInputs";
import { useModalController } from "@/hooks/useModalController";
import { LeadFinderFormSchemaType } from "../../types/forms";
import { useProspectMutation } from "../../_hooks/useProspectMutation";



export const SearchProspectForm = () => {
    const { form } = useSearchProspectForm()
    const modalController = useModalController()
    const { createSearchProspect } = useProspectMutation()

    const close = () => {
        modalController.close()
    }



    const onSubmit = async (data: LeadFinderFormSchemaType) => {
        await createSearchProspect(data)
        close()
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:w-[38rem]" >
            <DialogHeader>
                <DialogTitle className="font-display text-2xl tracking-[0.02em] text-primary-700">
                    Nouvelle recherche
                </DialogTitle>

            </DialogHeader>
            <SearchFormInputs form={form} />
            <div className="flex justify-end gap-4 w-full">
                <Button type="button" variant="outline" size="lg" onClick={close} >
                    Annuler
                </Button>
                <Button type="submit" size="lg" >
                    Lancer le sourcing
                </Button>
            </div>
        </form>
    )
}