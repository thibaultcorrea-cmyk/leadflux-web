"use client"

import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Email, EmailVersion } from "../../types/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputController from "@/components/shared/forms/InputController";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useEmailForm } from "../../_hooks/useEmailForm";
import { Textarea } from "@/components/ui/textarea";
import { emailToEmailFormFaktorySchema } from "../../schema/email-schema-faktory";
import { useTransition } from "react";


interface EditEmailFormProps {
    email: Email,
    version: EmailVersion
}

export const EditEmailForm = ({ email, version }: EditEmailFormProps) => {

    const defaultValues = emailToEmailFormFaktorySchema({ email, version });

    const { form, submitFn } = useEmailForm({ email, version, defaultValues })
    const confirmLabel = "Enregistrer"

    const emailEmailId = email.id
    const emailVersionId = version.id

    const title = "Modification de l'email"
    const description = <>Modification de l'email adressé à <strong>{email.contactName}</strong></>





    return (
        <form onSubmit={form.handleSubmit(submitFn)} className="flex flex-col gap-3 w-full">
            <DialogHeader>
                <DialogTitle className="font-display text-2xl tracking-[0.02em] text-primary-700">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-ink-700">
                    {description}
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 pt-3 pb-5">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor={"subject"}>Objet de l'email</FieldLabel>
                        <Input id={"subject"} {...form.register("subject")} type={"text"} placeholder={"Objet de l'email"} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={"recipient"}>Email de l'expéditeur</FieldLabel>
                        <Input id={"recipient"} {...form.register("recipient")} type={"email"} placeholder={"email du destinataire"} />
                    </Field>
                </FieldGroup>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor={"body"}>Contenu de l'email</FieldLabel>
                        <Textarea id={"body"} {...form.register("body")} placeholder={"Contenu de l'email"} className="w-full min-h-48 max-h-72 resize-none" />
                    </Field>
                </FieldGroup>
            </div>
            <DialogFooter>
                <Button type="submit" size="lg" className={"w-full"}>{confirmLabel}</Button>
            </DialogFooter>
        </form>
    )
}


export default EditEmailForm;