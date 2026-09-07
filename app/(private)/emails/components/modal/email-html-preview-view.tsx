"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useRenderEmailHtml } from "../../_hooks/useRenderEmailHtml";
import { Email, EmailVersion } from "../../types/email";
import EmailRecipientSubjectHeader from "./email-recipient-subject-header";

interface EmailHtmlPreviewViewProps {
    email: Email;
    version: EmailVersion;
}

/** Rendu HTML complet de l'email (tel qu'il sera reçu), affiché par le switch « Aperçu email ». */
const EmailHtmlPreviewView = ({ email, version }: EmailHtmlPreviewViewProps) => {
    const { html, isLoading } = useRenderEmailHtml(version.body);

    return (
        <>
            <div className="flex flex-col gap-3">
                {isLoading ? (
                    <Skeleton className="h-[55vh] w-full" />
                ) : (
                    <iframe
                        title={`Aperçu HTML de l'email pour ${email.contactName}`}
                        srcDoc={html ?? undefined}
                        sandbox=""
                        className="h-[55vh] w-full rounded-lg border border-border bg-background-100"
                    />
                )}
            </div>
        </>
    );
};

export default EmailHtmlPreviewView;
