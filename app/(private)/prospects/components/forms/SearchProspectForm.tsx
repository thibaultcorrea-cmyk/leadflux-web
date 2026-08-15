"use client"

import SelectController from "@/components/shared/forms/SelectController"
import { useSearchProspectForm } from "../../_hooks/useSearchProspectForm"
import { FieldGroup } from "@/components/ui/field"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchFormInputs } from "./SearchFormInputs";
import { useModalController } from "@/hooks/useModalController";
import { CardContent } from "@/components/ui/card";



export const SearchProspectForm = () => {

    const { form } = useSearchProspectForm()

    const modalController = useModalController()

    const close = () => {
        modalController.close()
    }

    const industries = [{
        value: "1",
        label: "Industrie 1"
    }, {
        value: "2",
        label: "Industrie 2"
    }, {
        value: "3",
        label: "Industrie 3"
    }]

    const onSubmit = () => {
        console.log("onsubmit");

    }

    console.log(form.getValues());
    console.log(form.formState.errors);

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