"use client";

import { useEffect, useState } from "react";

import { renderProspectEmailHtml } from "@/features/emails/templates/render-email-html";
import { getLogoFromCompany } from "@/lib/utils";

/**
 * Rend un corps d'email en HTML complet via le vrai template d'envoi
 * (`renderProspectEmailHtml`), pour le switch « Aperçu email » de la modale :
 * bascule le corps texte brut vers le rendu réel (logo, footer, lien de
 * désinscription) sans quitter la modale.
 */
export function useRenderEmailHtml(body: string) {
  // Gardé avec le body qui l'a produit : évite d'exposer un HTML rendu pour
  // le corps précédent le temps que le nouveau rendu arrive.
  const [rendered, setRendered] = useState<{ body: string; html: string } | null>(null);
  const COMPANY_LOGO_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/logo`

  useEffect(() => {
    let cancelled = false;
    getLogoFromCompany(COMPANY_LOGO_URL).then((logo) => {

      renderProspectEmailHtml(body, logo).then((result) => {
        if (!cancelled) {
          setRendered({ body, html: result });
        }
      });
    })

    return () => {
      cancelled = true;
    };
  }, [body]);

  const html = rendered?.body === body ? rendered.html : null;

  return { html, isLoading: html === null };
}
