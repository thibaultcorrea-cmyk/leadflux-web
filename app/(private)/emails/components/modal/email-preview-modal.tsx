"use client";

import { FileText, Pencil, RefreshCw, Redo2, Send, Undo2 } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";

import { EmailStatusBadge } from "@/components/shared/badges/email-status-badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Email } from "../../types/email";
import EmailStaticView from "./email-static-view";
import { EmailInputView } from "./email-input-view";
import { useEmailForm } from "../../_hooks/useEmailForm";
import { emailToEmailFormFaktorySchema } from "../../schema/email-schema-faktory";

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
  onEdit: (email: Email) => void;
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
  onEdit,
  onRegenerate,
  onValidate,
}: EmailPreviewModalProps) {
  const lastIndex = email.versions.length - 1;
  const [versionIndex, setVersionIndex] = useState(lastIndex);
  const [isEditing, setIsEditing] = useState(false);
  const version = email.versions[versionIndex];

  const canUndo = versionIndex > 0;
  const canRedo = versionIndex < lastIndex;

  const defaultValues = emailToEmailFormFaktorySchema({ email, version: version })
  const { form } = useEmailForm({ email, version, defaultValues })





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
          {email.versions.length > 1
            ? `Version ${versionIndex + 1} sur ${email.versions.length}`
            : "Version initiale"}{" "}
          · Rédaction puis passe d&apos;humanisation · Jamais envoyé
          automatiquement
        </p>

        <div className="border-t border-border" />
        {isEditing ? <EmailInputView form={form} email={email} version={version} /> : <EmailStaticView email={email} version={version} />}

        {/* <p className="flex items-start gap-2.5 rounded-lg border border-border bg-background-100 p-3 text-xs leading-relaxed text-ink-700">
          <FileText className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden />
          Rédigé à partir de votre PDF de connaissance client, version du{" "}
          {version.knowledgeVersion}.
        </p>*/}
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
                  onClick={() => setVersionIndex((index) => index - 1)}
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
                  onClick={() => setVersionIndex((index) => index + 1)}
                />
              }
            >
              <Redo2 className="size-4" aria-hidden />
            </TooltipTrigger>
            <TooltipContent>Génération suivante</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 gap-2 px-4 text-sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="size-4" aria-hidden />
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 gap-2 px-4 text-sm"
            onClick={() => onRegenerate(email)}
          >
            <RefreshCw className="size-4" aria-hidden />
            Régénérer
          </Button>
          <Button
            type="button"
            size="lg"
            className="h-11 gap-2 px-5 text-[15px] font-semibold"
            onClick={() => onValidate(email)}
          >
            <Send className="size-4" aria-hidden />
            Valider et envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}
