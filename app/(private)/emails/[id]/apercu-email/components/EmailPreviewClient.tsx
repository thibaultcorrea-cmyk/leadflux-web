"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { EmailStatusBadge } from "@/components/shared/badges/email-status-badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailPreviewHtml } from "../hooks/useEmailPreviewHtml";

/** Initiales du prospect, pour l'avatar de l'entête (même logique que la modale d'aperçu). */
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function EmailPreviewClient({ emailId }: { emailId: string }) {
  const { email, version, html, isLoading } = useEmailPreviewHtml(emailId);

  return (
    <div className="flex flex-col gap-5 p-6 lg:p-8">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-1.5 text-ink-700"
        nativeButton={false}
        render={<Link href="/emails" />}
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Retour aux emails
      </Button>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full max-w-md" />
          <Skeleton className="h-[70vh] w-full" />
        </div>
      ) : !email || !version ? (
        <Empty className="border-border">
          <EmptyHeader>
            <EmptyTitle>Email introuvable</EmptyTitle>
            <EmptyDescription>
              Cet email n&apos;existe plus ou a été supprimé.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" nativeButton={false} render={<Link href="/emails" />}>
              Retour aux emails
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-full bg-primary-50 text-[15px] font-semibold text-primary-700"
              >
                {getInitials(email.contactName)}
              </span>
              <div className="flex flex-col gap-0.5">
                <h1 className="text-[17px] font-semibold text-ink-900">
                  {email.contactName}
                </h1>
                <p className="text-[13px] text-ink-500">
                  {email.contactRole} · {email.company} · {email.city}
                </p>
              </div>
            </div>
            <EmailStatusBadge status={email.status} className="py-1.5" />
          </header>

          <dl className="flex flex-col gap-1.5 rounded-lg border border-border bg-background-100 px-4 py-3">
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-xs font-semibold tracking-[0.03em] text-ink-500">
                À
              </dt>
              <dd className="text-[13px] text-ink-700">{email.recipient}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-xs font-semibold tracking-[0.03em] text-ink-500">
                OBJET
              </dt>
              <dd className="text-[13px] font-medium text-ink-900">
                {version.subject}
              </dd>
            </div>
          </dl>

          <p className="text-xs text-ink-500">
            Rendu HTML tel qu&apos;il sera reçu, en lecture seule. Aucune
            action ici : pour modifier, régénérer ou valider et envoyer,
            utilisez « Aperçu de l&apos;email » depuis le tableau.
          </p>

          <iframe
            title={`Aperçu de l'email pour ${email.contactName}`}
            srcDoc={html ?? undefined}
            sandbox=""
            className="min-h-[70vh] w-full rounded-xl border border-border bg-background-100"
          />
        </div>
      )}
    </div>
  );
}
