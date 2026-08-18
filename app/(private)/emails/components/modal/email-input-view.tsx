"use client";

import { Input } from "@/components/ui/input";
import { Email, EmailVersion } from "../../types/email";
import { UseFormReturn } from "react-hook-form";
import { EmailFormValues } from "../../schema/email-form-schema";
import { Textarea } from "@/components/ui/textarea";

interface EmailInputViewProps {
    email: Email;
    version: EmailVersion;
    form: UseFormReturn<EmailFormValues>
}
export const EmailInputView = ({ email, version, form }: EmailInputViewProps) => {

    const { register, watch } = form

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
                {/*  <p className="text-sm leading-relaxed text-ink-700 whitespace-pre-line px-1.5 overflow-y-auto max-h-[42vh] border rounded-lg p-2 " contentEditable={true} suppressContentEditableWarning={true} >
                    {watch("body")}
                </p>*/}

                <Textarea {...register("body")} aria-label="Corps du message" placeholder="Corps du message" className="min-h-[42vh] max-h-[42vh] overflow-y-auto" />


            </div>
        </dl>
    );
};
