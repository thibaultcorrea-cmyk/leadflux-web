"use client"

import InputController from "@/components/shared/forms/InputController"
import { FieldGroup } from "@/components/ui/field"
import { UseFormReturn } from "react-hook-form"
import { Prospect } from "../../types/prospect"


export const ProspectFormInputs = ({ form }: { form: UseFormReturn<Prospect> }) => {
    return (
        <div className="p-3 flex flex-col gap-5 w-full" >
            <FieldGroup className="grid grid-cols-2 gap-5 space-y-2" >
                <InputController control={form.control} name="company" label="Société" type="text" />
                <InputController control={form.control} name="contactName" label="Contact" type="text" />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2 gap-5 space-y-2" >
                <InputController control={form.control} name="contactRole" label="Poste" type="text" />
                <InputController control={form.control} name="sector" label="Secteur" type="text" />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2 gap-5 space-y-2" >
                <InputController control={form.control} name="city" label="Ville" type="text" />
                <InputController control={form.control} name="headcountLabel" label="Effectif" type="text" />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2 gap-5 space-y-2" >
                <InputController control={form.control} name="headcountMin" label="Effectif min" type="number" />
                <InputController control={form.control} name="headcountMax" label="Effectif max" type="number" />
            </FieldGroup>
        </div>
    )
}