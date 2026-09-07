"use client";

import { Input } from "@/components/ui/input";
import { Email, EmailVersion } from "../../types/email";
import { UseFormReturn } from "react-hook-form";
import { EmailFormValues } from "../../schema/email-form-schema";
import RichTextController from "@/components/shared/forms/RichTextController";

interface EmailInputViewProps {
    email: Email;
    version: EmailVersion;
    form: UseFormReturn<EmailFormValues>
}
export const EmailInputView = ({ email, version, form }: EmailInputViewProps) => {

    const { register } = form

    return (
        <dl className="flex flex-col gap-3" >
            <dl className="flex flex-col gap-2">
                <div className="flex gap-3 items-center w-full">
                    <dt className="w-12 shrink-0 text-xs font-semibold tracking-[0.03em] text-ink-500">
                        À
                    </dt>
                    <dd className="text-[13px] text-ink-700 w-full">
                        <Input className="w-full" {...register("recipient")} aria-label="Email destinataire" placeholder="Email destinataire" />
                    </dd>
                </div>
                <div className="flex gap-3 items-center w-full">
                    <dt className="w-12 shrink-0 pt-0.5 text-xs font-semibold tracking-[0.03em] text-ink-500">
                        OBJET
                    </dt>
                    <dd className="text-base font-semibold text-ink-900 w-full">
                        <Input className="w-full" {...register("subject")} aria-label="Objet" placeholder="Objet" />
                    </dd>
                </div>
            </dl>
            <div className="flex flex-col gap-3 border-t border-border pt-4 ">
                <RichTextController form={form} name="body" label="Corps du message" className="min-h-48 max-h-72 resize-none " />
            </div>
        </dl>
    );
};
