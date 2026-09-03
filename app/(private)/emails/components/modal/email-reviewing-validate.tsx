
"use client"

import { useState, useTransition } from "react";
import { Email, EmailVersion } from "../../types/email"
import { getIdsOfDraftedEmails, getLastVersion } from "../../services/utils";
import { Button } from "@/components/ui/button";
import { waitDelay } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { useModalController } from "@/hooks/useModalController";
import { showUserInitials } from "@/lib/user-session";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { EmailStatusBadge } from "@/components/shared/badges/email-status-badge";
import { useEmailMutation } from "../../_hooks/useEmailMutation";
import { toast } from "@/lib/toaster";
import { dialogMessages } from "../../services/dialog-messages";
import { reportErrorClient } from "@/lib/report-error-client";

type EmailReviewingValidateModalContentProps = {
    selectedEmails: Email[],
}

export const EmailReviewingValidateModalContent = ({ selectedEmails }: EmailReviewingValidateModalContentProps) => {

    const { validateSendEmailsMany } = useEmailMutation()
    const [currentEmailIndex, setCurrentEmailIndex] = useState(0);

    const currentEmail = selectedEmails[currentEmailIndex];
    const CAN_NEXT = currentEmailIndex < selectedEmails.length - 1;
    const CAN_PREVIOUS = currentEmailIndex > 0;

    const handleNext = () => {
        if (CAN_NEXT) {
            setCurrentEmailIndex(currentEmailIndex + 1);
        }
    }

    const handlePrevious = () => {
        if (CAN_PREVIOUS) {
            setCurrentEmailIndex(currentEmailIndex - 1);
        }
    }

    const sendValidateEmails = async () => {
        try {
            const ids = getIdsOfDraftedEmails(selectedEmails)
            const { validateAndSendEmailsMany } = await validateSendEmailsMany({ ids })

            const success = validateAndSendEmailsMany.success
            const failed = validateAndSendEmailsMany.failed

            const messages = {
                title: "Email envoyé",
                description: `${success} email${success !== 1 ? "s" : ""} envoyé${success !== 1 ? "s" : ""} avec succès, ${failed} échec${failed !== 1 ? "s" : ""} d'envoi`,
            }
            toast.info(messages)
        } catch (error) {
            reportErrorClient(error as Error, "Erreur lors de l'envoi d'emails")
            toast.error(dialogMessages.sendMany.error)
        }

    }

    const sizeTotalEmails = selectedEmails.length;
    const currentEmailNumber = currentEmailIndex + 1;

    const lastVersion = getLastVersion(currentEmail.versions)

    return (


        <div className="flex flex-col gap-3">
            <HeaderReviewingValidateModalContent email={currentEmail} version={lastVersion} />
            <ContentEmailReviewingValidateModalContent email={currentEmail} version={lastVersion} />
            <FooterReviewingValidateModalContent email={currentEmail} version={lastVersion} canNext={CAN_NEXT} canPrev={CAN_PREVIOUS} currentEmailNumber={currentEmailNumber} sizeTotalEmails={sizeTotalEmails} handleNext={handleNext} handlePrev={handlePrevious} submit={sendValidateEmails} />
        </div>

    )
}




const HeaderReviewingValidateModalContent = ({ email, version }: { email: Email, version: EmailVersion }) => {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <span
                    aria-hidden
                    className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-[15px] font-semibold text-primary-700"
                >
                    {showUserInitials(email.contactName)}
                </span>
                <div className="flex flex-col gap-0.5">
                    <DialogTitle className="text-[17px] font-semibold text-ink-900">
                        {email.contactName}
                    </DialogTitle>
                    <DialogDescription className="text-[13px] text-ink-500">
                        {email.contactRole} · {email.company} · {email.city}
                    </DialogDescription>
                </div>
            </div>
            {/* Le bouton de fermeture est fourni par la modale partagée. */}
            <EmailStatusBadge status={email.status} className="mr-9 py-1.5" />
        </header>


    )
}


const ContentEmailReviewingValidateModalContent = ({ email, version }: { email: Email, version: EmailVersion }) => {
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
    )
}

const FooterReviewingValidateModalContent = ({ email, version, canPrev, canNext, currentEmailNumber, sizeTotalEmails, handlePrev, handleNext, submit }: { email: Email, version: EmailVersion, canPrev: boolean, canNext: boolean, currentEmailNumber: number, sizeTotalEmails: number, handlePrev: () => void, handleNext: () => void, submit: () => Promise<void> }) => {

    const [isPending, startTransition] = useTransition()
    const { close } = useModalController()


    const handleValidate = () => {
        startTransition(async () => {
            try {
                await waitDelay(1000)
                await submit()

                close()
            } catch (error) {
                console.log(error)

            }

        })
    }

    return (

        <div className="-mx-4 -mb-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-b-xl border-t border-border bg-background-100 px-6 py-4">
            <div className="flex items-center gap-3">
                <Tooltip>
                    <TooltipTrigger
                        id="tooltip-previous-email"
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                disabled={!canPrev}
                                aria-label="Voir l'email précédent"
                                onClick={handlePrev}
                            />
                        }
                    >
                        <ArrowLeft className="size-4" aria-hidden />
                    </TooltipTrigger>
                    <TooltipContent id="tooltip-previous-email">Voir l'email précédent</TooltipContent>
                </Tooltip>
                <p>{currentEmailNumber}/{sizeTotalEmails}</p>
                <Tooltip>
                    <TooltipTrigger
                        id="tooltip-next-email"
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                disabled={!canNext}
                                aria-label="Evoir l'email suivant"
                                onClick={handleNext}
                            />
                        }
                    >
                        <ArrowRight className="size-4" aria-hidden />
                    </TooltipTrigger>
                    <TooltipContent id="tooltip-next-email">Voir l'email suivant</TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    size="lg"
                    className="h-11 gap-2 px-5 text-[15px] font-semibold"
                    onClick={handleValidate}
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="animate-spin inline-block size-4" /> : <Send className="size-4" aria-hidden />}
                    {isPending ? "Envoi en cours" : "Envoyer"}
                </Button>
            </div>
        </div>



    )
}
