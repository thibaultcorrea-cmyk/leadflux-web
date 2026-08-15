"use client"

import { FieldGroup } from "@/components/ui/field"
import SelectController from "@/components/shared/forms/SelectController"
import { UseFormReturn } from "react-hook-form"
import { COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS, JOB_TITLES_OPTIONS, REVENUE_OPTIONS } from "../../services/select-options"
import InputController from "@/components/shared/forms/InputController"

export const SearchFormInputs = ({ form }: { form: UseFormReturn<any> }) => {

    return (
        <div className="p-3 flex flex-col gap-5 w-full" >
            <FieldGroup className="grid grid-cols-2 gap-5 space-y-2" >
                <SelectController form={form} name="industry" label="Secteur d'activité" options={INDUSTRY_OPTIONS as any} />
                <SelectController form={form} name="jobTitle" label="Poste du décideur" options={JOB_TITLES_OPTIONS as any} />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2 gap-5 space-y-2" >
                <InputController control={form.control} name="location" label="Localisation" type="text" />
                <SelectController form={form} name="employeeRange" label="Taille de l'entreprise" options={COMPANY_SIZE_OPTIONS as any} />
            </FieldGroup>
            <SelectController form={form} name="revenue" label="Chiffre d'affaire" options={REVENUE_OPTIONS as any} />

        </div>
    )
}