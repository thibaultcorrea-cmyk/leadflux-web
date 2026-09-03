"use client"

import { useForm } from "react-hook-form"
import { emailFormSchema, EmailFormValues } from "../schema/email-form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Email, EmailVersion } from "../types/email";
import { useTransition } from "react";
import { useModalController } from "@/hooks/useModalController";
import { useEmailMutation } from "./useEmailMutation";
import { toast } from "@/lib/toaster";
import { dialogMessages } from "../services/dialog-messages";
import { reportErrorClient } from "@/lib/report-error-client";


interface UseEmailFormProps {
    email: Email;
    version: EmailVersion;
    defaultValues: Partial<EmailFormValues>
}
export const useEmailForm = ({ email, version, defaultValues }: UseEmailFormProps) => {
    const [isPending, startTransition] = useTransition();
    const { close } = useModalController()
    const { update } = useEmailMutation()

    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailFormSchema),
        defaultValues
    })




    const submitFn = (values: EmailFormValues) => {
        startTransition(async () => {
            try {
                const emailId = email.id
                const versionId = version.id

                await update({
                    emailId,
                    versionId,
                    ...values
                })

                close()
                toast.success(dialogMessages.update.success)
            } catch (error) {
                reportErrorClient(error as Error, dialogMessages.update.error.title)
                toast.error(dialogMessages.update.error)
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
