"use client"

import { FieldGroup } from "@/components/ui/field"
import SelectController from "@/components/shared/forms/SelectController"
import { UseFormReturn } from "react-hook-form"

export const SearchFormInputs = ({ form }: { form: UseFormReturn<any> }) => {
    const industries = [{ value: "1", label: "Industrie 1" }, { value: "2", label: "Industrie 2" }, { value: "3", label: "Industrie 3" }]
    return (
        <div className="p-3 flex flex-col gap-4" >
            <FieldGroup className="grid grid-cols-2 gap-4" >
                <SelectController form={form} name="industry" label="Secteur d'activité" options={industries} />
                <SelectController form={form} name="industry" label="Poste du décideur" options={industries} />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2 gap-4" >
                <SelectController form={form} name="industry" label="Localisation" options={industries} />
                <SelectController form={form} name="industry" label="Taille de l'entreprise" options={industries} />
            </FieldGroup>
            <SelectController form={form} name="industry" label="Chiffre d'affaire" options={industries} />

        </div>
    )
}