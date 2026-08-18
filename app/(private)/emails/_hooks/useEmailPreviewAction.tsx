"use client"

import { useModalController } from "@/hooks/useModalController";
import { EmailPreviewModal } from "../components/modal/email-preview-modal";
import { ConfirmModalContent } from "@/components/shared/Modals/ConfirmModalContent";
import { Email } from "../types/email";
import EditEmailForm from "../components/forms/edit-email-form";

/** L'aperçu suit la longueur de ligne de lecture du design system : 720 px. */
const PREVIEW_MODAL_CLASSNAME = "sm:min-w-[38vw] sm:max-w-[46vw]";
const EDIT_MODAL_CLASSNAME = "sm:max-w-[42vw]";

export const useEmailPreviewAction = () => {

    const { open } = useModalController();

    const confirm = (props: {
        title: string;
        description: React.ReactNode;
        confirmLabel: string;
        tone?: "default" | "destructive";
    }) => open({ components: <ConfirmModalContent {...props} /> });

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
                        confirm({
                            title: "Valider et envoyer",
                            description: `L'email sera envoyé à ${current.recipient}. C'est la seule étape qui déclenche un envoi.`,
                            confirmLabel: "Valider et envoyer",
                        })
                    }
                />
            ),
        });


    const openEditView = (email: Email) => open({
        contentClassName: EDIT_MODAL_CLASSNAME,
        components: <EditEmailForm email={email} version={email.versions[0]} />
    })

    return { openPreview, openEditView };
}

