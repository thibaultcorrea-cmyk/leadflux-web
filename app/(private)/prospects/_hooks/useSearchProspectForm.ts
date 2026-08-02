"use client"

import { useForm } from "react-hook-form"
import { LeadFinderFormSchemaType } from "../types/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { leadFinderFormSchema } from "../schema/form-schema"

export const useSearchProspectForm = () => {
    const form = useForm<LeadFinderFormSchemaType>({
        resolver: zodResolver(leadFinderFormSchema),
    })
    return {
        form,
        errors: form.formState.errors,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,

    }
}