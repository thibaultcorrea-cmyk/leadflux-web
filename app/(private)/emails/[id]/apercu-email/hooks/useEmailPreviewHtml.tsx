"use client";

import { useEffect, useState } from "react";

import { renderProspectEmailHtml } from "@/features/emails/templates/render-email-html";
import { useFetchEmails } from "../../../_hooks/useFetchEmail";
import { getLastVersion } from "../../../services/utils";
import type { Email } from "../../../types/email";

/**
 * Trouve l'email par id dans le cache TanStack Query de la liste (pas de
 * requête dédiée par id : `GET_EMAIL_PROSPECTS` sert déjà toute la donnée,
 * voir CLAUDE.md §7 sur TanStack Query comme seule source de state serveur),
 * puis rend sa dernière version en HTML complet via `renderProspectEmailHtml`
 * (build navigateur de `@react-email/render`, résolu automatiquement ici
 * puisque ce hook est côté client) pour affichage dans l'iframe de la page
 * d'aperçu.
 */
export function useEmailPreviewHtml(emailId: string) {
  const { emails, isLoading: isLoadingEmails, error } = useFetchEmails();
  const email = (emails as Email[]).find((item) => item.id === emailId);
  const version = email ? getLastVersion(email.versions) : undefined;

  // Gardé avec l'id de version qui l'a produit : évite d'exposer un HTML
  // rendu pour la version précédente le temps que le nouveau rendu arrive.
  const [rendered, setRendered] = useState<{ versionId: string; html: string } | null>(null);

  useEffect(() => {
    if (!version) {
      return;
    }

    let cancelled = false;

    renderProspectEmailHtml(version.body).then((result) => {
      if (!cancelled) {
        setRendered({ versionId: version.id, html: result });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const html = version && rendered?.versionId === version.id ? rendered.html : null;

  return {
    email,
    version,
    html,
    isLoading: isLoadingEmails || (Boolean(email) && html === null),
    error,
  };
}
