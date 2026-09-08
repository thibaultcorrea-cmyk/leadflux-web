import { CopyButton } from "@/components/shared/Buttons/CopyButton";
import { Email, EmailVersion } from "../../types/email";

interface EmailRecipientSubjectHeaderProps {
    email: Email;
    version: EmailVersion;
}

/** Bloc « À / OBJET » commun aux vues de lecture seule (texte brut, rendu HTML). */
const EmailRecipientSubjectHeader = ({ email, version }: EmailRecipientSubjectHeaderProps) => {
    return (
        <dl className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <dt className="w-12 shrink-0 text-xs font-semibold tracking-[0.03em] text-ink-500">
                    À
                </dt>
                <dd className="flex items-center gap-1.5 text-[13px] text-ink-700">
                    {email.recipient}
                    <CopyButton
                        text={email.recipient}
                        label="Copier l'adresse email du destinataire"
                    />
                </dd>
            </div>
            <div className="flex gap-3">
                <dt className="w-12 shrink-0 pt-0.5 text-xs font-semibold tracking-[0.03em] text-ink-500">
                    OBJET
                </dt>
                <dd className="text-base font-semibold text-ink-900">
                    {version.subject}
                </dd>
            </div>
        </dl>
    );
};

export default EmailRecipientSubjectHeader;
