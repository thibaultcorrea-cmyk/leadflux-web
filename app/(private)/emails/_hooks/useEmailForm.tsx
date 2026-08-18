"use client"

import { useForm } from "react-hook-form"
import { emailFormSchema, EmailFormValues } from "../schema/email-form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Email, EmailVersion } from "../types/email";
import { useTransition } from "react";
import { useModalController } from "@/hooks/useModalController";


interface UseEmailFormProps {
    email: Email;
    version: EmailVersion;
    defaultValues: Partial<EmailFormValues>
}
export const useEmailForm = ({ email, version, defaultValues }: UseEmailFormProps) => {
    const [isPending, startTransition] = useTransition();
    const { close } = useModalController()

    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailFormSchema),
        defaultValues
    })




    const submitFn = (values: EmailFormValues) => {
        startTransition(async () => {
            try {
                const emailId = email.id
                const versionId = version.id
                //call api function here

                close()
            } catch (error) {
                console.log(error)
            }
        })

    }


    return {
        form,
        errors: form.formState.errors,
        isPending,
        submitFn
    }

}
