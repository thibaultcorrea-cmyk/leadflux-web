type ProspectEmailTemplatePremiumProps = {
  /** Corps de l'email au format HTML (paragraphes, listes, gras/italique/souligné). */
  body: string;
};

/**
 * Polices web-safe uniquement : les clients email ignorent `next/font` et la
 * plupart des `@font-face` personnalisées. Ces piles se substituent à
 * League Gothic / Inter dans l'esprit de la DA (design.md §2) sans dépendre
 * d'un chargement de police.
 */
const FONT_DISPLAY = "Georgia, 'Times New Roman', serif";
const FONT_UI = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/**
 * Repère de marque en PNG (`public/images/company-logo-placeholder.png`),
 * pas en SVG : un `<svg>` inline évitait le crash `lucide-react` (icônes
 * tagguées `"use client"`, incompatibles avec `render()` côté serveur —
 * voir l'historique de ce fichier) mais reste illisible dans Outlook
 * desktop, qui ne supporte pas le SVG en email. Un PNG n'a ni l'un ni
 * l'autre problème : aucune frontière client/serveur, et supporté partout.
 *
 * URL absolue et non un chemin relatif : un email ouvert chez le
 * destinataire n'a pas d'origine sur laquelle résoudre `/images/...`,
 * contrairement à l'aperçu client qui tourne sur le même domaine que l'app.
 *
 * `process.env.NEXT_PUBLIC_APP_URL` en accès direct, jamais `ENV` de
 * `@/core/env` : ce module valide tout le schéma d'environnement au chargement,
 * secrets serveur compris (`BETTER_AUTH_SECRET`...). Ce template est importé
 * depuis le hook client de l'aperçu (`useEmailPreviewHtml.tsx`) autant que
 * depuis l'envoi serveur — l'importer ferait entrer `core/env.ts` dans le
 * bundle navigateur, où ces secrets valent `undefined` : la validation Zod
 * plante au chargement du module. `NEXT_PUBLIC_APP_URL` est en revanche
 * conçue pour être lue telle quelle des deux côtés (Next.js l'inline
 * statiquement dans les deux bundles).
 */
const BRAND_MARK_URL = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/images/company-logo-placeholder.png`;

/**
 * Placeholder : aucune adresse de contact réelle n'est encore actée pour
 * Leadflux (CLAUDE.md §8 — hébergement et domaine non tranchés). Un `mailto:`
 * reste la désinscription la plus simple à honorer sans backend dédié : pas
 * de lien à un jour vérifier/révoquer, pas de token à générer côté serveur.
 * À remplacer par la vraie adresse de contact (et, si le volume l'exige un
 * jour, par un vrai lien de désabonnement en un clic) une fois décidée.
 */
const UNSUBSCRIBE_MAILTO =
  "mailto:contact@leadflux.local?subject=D%C3%A9sinscription%20des%20emails%20de%20prospection";

/** Coupe proprement une chaîne HTML en texte brut, pour le préheader. */
function toPreviewText(html: string, maxLength: number): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

/**
 * Variante « premium » du template d'email, proposée à côté de
 * `ProspectEmailTemplate` (celui-ci n'est pas modifié ni retiré — voir
 * `render-email-html.tsx` pour le point d'entrée de rendu utilisé par la
 * page d'aperçu, aujourd'hui branché sur cette variante).
 *
 * Vit dans `features/emails/` (et non sous la page `apercu-email`) pour
 * rester importable aussi bien depuis le client (aperçu, via le build
 * navigateur de `@react-email/render`) que depuis un futur envoi côté
 * serveur (build Node du même `render()`, même composant, même HTML) —
 * `features/` ne doit jamais dépendre d'un composant rangé sous `app/`.
 *
 * Mêmes contraintes que l'original : couleurs en hex brut et styles en ligne
 * uniquement, un client email ne lit ni variables CSS ni classes Tailwind
 * (dérogation volontaire à la règle « jamais de hex brut », CLAUDE.md §7).
 *
 * Ajouts par rapport à l'original, dans les limites de la DA (design.md) et
 * de ce qui reste raisonnable dans un email (§4 : pas de dégradé, pas
 * d'ombre lourde, un seul CTA — ici aucun, ce n'est pas au template
 * d'inventer un bouton que la donnée ne contient pas) :
 * - Préheader caché : le texte qui apparaît dans l'aperçu de la boîte de
 *   réception (Gmail/Outlook), avant l'ouverture du mail.
 * - Liseré `accent-500` en tête de carte, repère de marque discret.
 * - Repère de marque (PNG `company-logo-placeholder`, voir `BRAND_MARK_URL`
 *   ci-dessous) et un sur-titre court sous le nom, dans le bandeau
 *   `primary-700`.
 * - Rythme d'espacement plus généreux (`shadow-md`/`radius-xl` de
 *   design.md §3, réservés aux cartes mises en avant) et accent de couleur
 *   sur les passages en gras du corps (signature).
 * - Mention de désinscription, centrée et hors de la carte (voir
 *   `UNSUBSCRIBE_MAILTO` ci-dessous).
 */
export function ProspectEmailTemplatePremium({
  body,
}: ProspectEmailTemplatePremiumProps) {
  const previewText = toPreviewText(body, 110);

  return (
    <html lang="fr">
      {/* eslint-disable-next-line @next/next/no-head-element -- document HTML autonome pour un email, pas une page Next : la règle App Router ne s'applique pas ici. */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          .email-body p { margin: 0 0 16px; }
          .email-body p:last-child { margin-bottom: 0; }
          .email-body ul, .email-body ol { margin: 0 0 16px; padding-left: 22px; }
          .email-body li { margin-bottom: 6px; }
          .email-body strong { font-weight: 700; color: #43142A; }
          .email-body em { font-style: italic; }
          .email-body u { text-decoration: underline; }
          .email-body a { color: #946315; text-decoration: underline; }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          padding: "40px 16px",
          backgroundColor: "#F5EFE6",
          fontFamily: FONT_UI,
        }}
      >
        {/* Préheader : texte d'aperçu dans la boîte de réception, invisible à l'ouverture. */}
        <div
          style={{
            display: "none",
            overflow: "hidden",
            lineHeight: "1px",
            maxHeight: 0,
            maxWidth: 0,
            opacity: 0,
          }}
        >
          {previewText}
        </div>

        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{
            maxWidth: 600,
            margin: "0 auto",
            backgroundColor: "#FFFCF7",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #E9E1D4",
            boxShadow:
              "0 4px 8px -2px rgb(35 24 28 / 0.08), 0 2px 4px -2px rgb(35 24 28 / 0.06)",
          }}
        >
          <tbody>
            {/* Liseré de marque, repère discret plutôt qu'un dégradé (design.md §4/§7). */}
            <tr>
              <td style={{ backgroundColor: "#D89727", padding: 0, height: 4, fontSize: 0, lineHeight: 0 }}>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style={{ backgroundColor: "#43142A", padding: "36px 40px", textAlign: "center" }}
              >
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  align="center"
                  style={{ margin: "0 auto" }}
                >
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: 12, verticalAlign: "middle" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- un client email doit recevoir une balise <img> classique avec une URL absolue, pas le composant next/image (optimisation et lazy-load côté serveur Next, sans objet ici). */}
                        <img
                          src={BRAND_MARK_URL}
                          alt="Leadflux"
                          width={40}
                          height={40}
                          style={{ display: "block", borderRadius: 9999 }}
                        />
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <div
                          style={{
                            fontFamily: FONT_DISPLAY,
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            color: "#FFFCF7",
                          }}
                        >
                          Leadflux
                        </div>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td style={{ padding: "44px 40px" }}>
                <div
                  className="email-body"
                  style={{ fontSize: 16, lineHeight: 1.7, color: "#23181C" }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style={{
                  padding: "24px 28px 28px",
                  borderTop: "1px solid #E9E1D4",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_UI,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#4A3B41",
                    marginBottom: 4,
                  }}
                >
                  Leadflux, agent de prospection d&apos;OxIAgen
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5, color: "#77656C" }}>
                  Aucun envoi n&apos;est automatique : cet email est toujours
                  relu et validé par un humain avant de partir.
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/*
          Désinscription : volontairement hors de la carte, comme le
          bandeau légal des emails transactionnels premium (Stripe, Linear).
          Sépare visuellement le message de son mention de conformité.
        */}
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ maxWidth: 600, margin: "20px auto 0" }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "0 24px", textAlign: "center" }}>
                <span style={{ fontSize: 12, lineHeight: 1.6, color: "#77656C" }}>
                  Vous recevez cet email dans le cadre d&apos;une démarche de
                  prospection commerciale.{" "}
                  <a
                    href={UNSUBSCRIBE_MAILTO}
                    style={{ color: "#946315", textDecoration: "underline" }}
                  >
                    Se désinscrire
                  </a>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
