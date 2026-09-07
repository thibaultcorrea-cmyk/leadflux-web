"use client";

import { Pencil, RefreshCw, Redo2, Send, Undo2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { EmailStatusBadge } from "@/components/shared/badges/email-status-badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Email, EmailVersion } from "../../types/email";
import EmailStaticView from "./email-static-view";
import { EmailInputView } from "./email-input-view";
import { useEmailForm } from "../../_hooks/useEmailForm";
import { emailToEmailFormFaktorySchema } from "../../schema/email-schema-faktory";
import type { EmailFormValues } from "../../schema/email-form-schema";
import { useEmailMutation } from "../../_hooks/useEmailMutation";
import { toast } from "@/lib/toaster";
import { dialogMessages } from "../../services/dialog-messages";
import { reportErrorClient } from "@/lib/report-error-client";

/** Initiales du prospect, pour l'avatar de l'entête. */
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type EmailPreviewModalProps = {
  email: Email;
  onRegenerate: (email: Email) => void;
  onValidate: (email: Email) => void;
};

/**
 * Aperçu de l'email (maquette « Emails V3 — Aperçu de l'email »).
 *
 * Annuler / Rétablir naviguent entre les générations successives conservées
 * dans `email.versions` — d'où une liste de versions dans le modèle plutôt
 * qu'un corps écrasé à chaque régénération (CLAUDE.md §3). Les deux boutons
 * sont désactivés aux extrémités, donc toujours sur un brouillon jamais
 * régénéré.
 */
export function EmailPreviewModal({
  email,
  onValidate,
}: EmailPreviewModalProps) {
  const lastIndex = email.versions.length - 1;
  const [versionIndex, setVersionIndex] = useState(lastIndex);
  const [isEditing, setIsEditing] = useState(false);
  const [versions, setVersions] = useState(email.versions)
  const [recipient, setRecipient] = useState(email.recipient)
  const [isPending, startTransition] = useTransition()
  const [isSavingEdit, startSavingEdit] = useTransition()

  const version = versions[versionIndex];
  // Copie d'affichage locale : le destinataire vit sur `emails`, pas sur la
  // version, mais se modifie dans le même formulaire. `email` reste le prop
  // d'origine (jamais rafraîchi tant que la modale ne se remonte pas), donc
  // toute donnée éditable affichée doit passer par cette copie locale plutôt
  // que par `email` directement (même logique que `versions` ci-dessus).
  const displayEmail = { ...email, recipient }

  const canUndo = versionIndex > 0 && !isEditing;
  const canRedo = versionIndex < versions.length - 1 && !isEditing;

  const defaultValues = emailToEmailFormFaktorySchema({ email: displayEmail, version: version })
  const { form } = useEmailForm({ email: displayEmail, version, defaultValues })
  const { regenerate, update } = useEmailMutation()


  const undo = () => {
    if (canUndo) {
      setVersionIndex((index) => index - 1);
    }
  };
  const redo = () => {
    if (canRedo) {
      setVersionIndex((index) => index + 1);
    }
  };

  const onRegenerateHandler = () => {
    startTransition(async () => {
      try {
        const { regenerateEmailContent } = await regenerate({ id: email.id })

        const newVersion = {
          id: regenerateEmailContent.id,
          subject: regenerateEmailContent.subject,
          body: regenerateEmailContent.body,
          knowledgeVersion: regenerateEmailContent.knowledgeVersion,
          generatedAt: regenerateEmailContent.generatedAt,
        } satisfies EmailVersion

        setVersions((current) => {
          const nextVersions = [...current, newVersion];
          setVersionIndex(nextVersions.length - 1);
          return nextVersions;
        });
        toast.success({
          title: "Nouvelle version de l'email",
          description: "Nouvelle version de l'email générée avec succès",
        })
      } catch (error) {
        reportErrorClient(error as Error, "Impossible de générer la version de l'email. Veuillez réessayer ultérieurement")
        toast.error({
          title: "Erreur lors de la génération de la version",
          description: "Impossible de générer la version de l'email. Veuillez réessayer ultérieurement",
        })
      }
    })
  };

  const enterEditMode = () => {
    // useForm ne reprend ses defaultValues qu'au montage : sans ce reset
    // explicite, rouvrir l'édition après une régénération (undo/redo) ou une
    // édition déjà confirmée réafficherait le tout premier contenu chargé.
    form.reset(emailToEmailFormFaktorySchema({ email: displayEmail, version }))
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const onConfirmEdit = (values: EmailFormValues) => {
    startSavingEdit(async () => {
      try {
        await update({
          emailId: email.id,
          versionId: version.id,
          ...values,
        })

        setVersions((current) =>
          current.map((v, index) =>
            index === versionIndex ? { ...v, subject: values.subject, body: values.body } : v,
          ),
        )
        setRecipient(values.recipient)

        toast.success(dialogMessages.update.success)
        setIsEditing(false)
      } catch (error) {
        reportErrorClient(error as Error, dialogMessages.update.error.title)
        toast.error(dialogMessages.update.error)
      }
    })
  };



  return (
    <div className="flex max-h-[85vh] flex-col">
      <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-2">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-[15px] font-semibold text-primary-700"
            >
              {getInitials(email.contactName)}
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

        <p className="text-xs text-ink-500">
          {versions.length > 1
            ? `Version ${versionIndex + 1} sur ${versions.length}`
            : "Version initiale"}{" "}
          · Rédaction puis passe d&apos;humanisation · Jamais envoyé
          automatiquement
        </p>

        <div className="border-t border-border" />
        {isEditing ? <EmailInputView form={form} email={displayEmail} version={version} /> : <EmailStaticView email={displayEmail} version={version} />}

        {/* 
          <p className="flex items-start gap-2.5 rounded-lg border border-border bg-background-100 p-3 text-xs leading-relaxed text-ink-700">
            <FileText className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden />
            Rédigé à partir de votre PDF de connaissance client, version du{" "}
            {version.knowledgeVersion}.
          </p>
        */}
      </div>

      <div className="-mx-4 -mb-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-b-xl border-t border-border bg-background-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  disabled={!canUndo}
                  aria-label="Revenir à la génération précédente"
                  onClick={undo}
                />
              }
            >
              <Undo2 className="size-4" aria-hidden />
            </TooltipTrigger>
            <TooltipContent>Génération précédente</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  disabled={!canRedo}
                  aria-label="Revenir à la génération suivante"
                  onClick={redo}
                />
              }
            >
              <Redo2 className="size-4" aria-hidden />
            </TooltipTrigger>
            <TooltipContent>Génération suivante</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 gap-2 px-4 text-sm"
                onClick={cancelEdit}
                disabled={isSavingEdit}
              >
                Annuler
              </Button>
              <Button
                type="button"
                size="lg"
                className="h-11 gap-2 px-5 text-[15px] font-semibold"
                onClick={form.handleSubmit(onConfirmEdit)}
                disabled={isSavingEdit}
              >
                {isSavingEdit && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Confirmer
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 gap-2 px-4 text-sm"
                onClick={enterEditMode}
              >
                <Pencil className="size-4" aria-hidden />
                Modifier
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 gap-2 px-4 text-sm"
                onClick={onRegenerateHandler}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <RefreshCw className="size-4" aria-hidden />}
                {isPending ? "Régénération en cours..." : "Régénérer"}
              </Button>
              <Button
                type="button"
                size="lg"
                className="h-11 gap-2 px-5 text-[15px] font-semibold"
                onClick={() => onValidate(email)}
                disabled={isPending}
              >
                <Send className="size-4" aria-hidden />
                Valider et envoyer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
