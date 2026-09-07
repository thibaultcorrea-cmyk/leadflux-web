"use client"

import { useModalController } from "@/hooks/useModalController";
import { EmailPreviewModal } from "../components/modal/email-preview-modal";
import { ConfirmActionMessages, ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import { Email } from "../types/email";
import EditEmailForm from "../components/forms/edit-email-form";
import { SendEmailConfirmModalContent } from "../components/modal/send-email-confirm";
import { useEmailMutation } from "./useEmailMutation";
import { getLastVersion } from "../services/utils";
import { EmailReviewingValidateModalContent } from "../components/modal/email-reviewing-validate";
import { dialogMessages } from "../services/dialog-messages";

/** L'aperçu suit la longueur de ligne de lecture du design system : 720 px. */
const PREVIEW_MODAL_CLASSNAME = "sm:min-w-[38vw] sm:max-w-[46vw]";
const EDIT_MODAL_CLASSNAME = "sm:max-w-[42vw]";


export const useEmailPreviewAction = () => {

    const { open } = useModalController();
    const { validateAndSend } = useEmailMutation()

    const confirm = (props: {
        title: string;
        description: React.ReactNode;
        confirmLabel: string;
        tone?: "default" | "destructive";
        onConfirm?: () => Promise<void>;
        onCancel?: () => Promise<void>;
        messages?: ConfirmActionMessages
    }) => open({ components: <ConfirmModalContent {...props} closeOnCancel={false} /> });

    const SendEmailConfirmModal = (props: {
        title: string;
        description: React.ReactNode;
        confirmLabel: string;
        tone?: "default" | "destructive";
        onConfirm?: () => Promise<void>;
        email: Email;
        onCancel?: () => Promise<void>;
        messages?: ConfirmActionMessages

    }) => {
        return (
            open({
                components: <SendEmailConfirmModalContent {...props} cancelLabel="Annuler" />
            })
        )
    }

    const openPreview = (email: Email) =>

        open({
            contentClassName: PREVIEW_MODAL_CLASSNAME,
            components: (
                <EmailPreviewModal
                    email={email}
                    onEdit={(current) =>
                        confirm({
                            title: "Modifier le brouillon",
                            description: `L'éditeur de l'email adressé à ${current.contactName} arrive dans un prochain lot.`,
                            confirmLabel: "Compris",

                        })

                    }
                    onRegenerate={(current) =>
                        confirm({
                            title: "Régénérer le brouillon",
                            description: `Une nouvelle version sera rédigée pour ${current.contactName}. Les versions précédentes restent accessibles depuis l'aperçu.`,
                            confirmLabel: "Régénérer",

                        })
                    }
                    onValidate={(current) =>
                        SendEmailConfirmModal({
                            email: current,
                            title: "Valider et envoyer",
                            description: `L'email sera envoyé à ${current.recipient}. C'est la seule étape qui déclenche un envoi.`,
                            confirmLabel: "Valider et envoyer",
                            onConfirm: async () => {
                                const lo = await validateAndSend({ id: current.id })
                                console.log(lo);

                            },

                            messages: dialogMessages.send

                        })
                    }
                />
            ),
        });


    const openEditView = (email: Email) => open({
        contentClassName: EDIT_MODAL_CLASSNAME,
        // key unique par ouverture : la modale reste montée en permanence
        // (ModalProvider ne fait que remplacer `components`), et l'id de
        // version ne change pas lors d'une simple édition de contenu. Sans
        // clé qui change à chaque ouverture, React met à jour la même
        // instance d'EditEmailForm au lieu de la remonter, et useForm ne
        // reprend ses defaultValues qu'au montage : rouvrir le même email
        // après l'avoir modifié laissait le formulaire (et l'éditeur riche)
        // sur ses valeurs de la toute première ouverture.
        components: <EditEmailForm key={`${email.id}-${Date.now()}`} email={email} version={getLastVersion(email.versions)} />
    })

    const openReviewingValidateView = (selectedEmails: Email[]) => open({
        contentClassName: EDIT_MODAL_CLASSNAME,
        components: <EmailReviewingValidateModalContent selectedEmails={selectedEmails} />
    })

    return { openPreview, openEditView, openReviewingValidateView };
}



