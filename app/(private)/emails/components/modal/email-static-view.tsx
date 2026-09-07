import { Email, EmailVersion } from "../../types/email";
import EmailRecipientSubjectHeader from "./email-recipient-subject-header";

interface EmailStaticViewProps {
    email: Email;
    version: EmailVersion;
}

const EmailStaticView = ({ email, version }: EmailStaticViewProps) => {
    return (
        <>
            <EmailRecipientSubjectHeader email={email} version={version} />
            <div className="flex flex-col gap-3 border-t border-border pt-4 ">
                <div
                    className="text-sm leading-relaxed text-ink-700 px-1.5 overflow-y-auto max-h-[42vh] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
                    dangerouslySetInnerHTML={{ __html: version.body }}
                />
            </div>
        </>
    );
};

export default EmailStaticView;