import { Email, EmailVersion } from "../../types/email";

interface EmailStaticViewProps {
    email: Email;
    version: EmailVersion;
}

const EmailStaticView = ({ email, version }: EmailStaticViewProps) => {

    return (
        <>
            <dl className="flex flex-col gap-2">
                <div className="flex gap-3">
                    <dt className="w-12 shrink-0 text-xs font-semibold tracking-[0.03em] text-ink-500">
                        À
                    </dt>
                    <dd className="text-[13px] text-ink-700">{email.recipient}</dd>
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
            <div className="flex flex-col gap-3 border-t border-border pt-4 ">
                <p className="text-sm leading-relaxed text-ink-700 whitespace-pre-line px-1.5 overflow-y-auto max-h-[42vh]">
                    {version.body}
                </p>
            </div>
        </>
    );
};

export default EmailStaticView;