type ProspectEmailTemplateProps = {
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
 * Template original de l'email de prospection (voir aussi la variante
 * `ProspectEmailTemplatePremium` dans ce même dossier). Rendu en HTML complet
 * via `@react-email/render` — voir `render-email-html.tsx` pour le point
 * d'entrée de rendu partagé entre l'aperçu client et un futur envoi serveur.
 *
 * Vit dans `features/emails/` plutôt que sous une page `app/` pour rester
 * importable des deux côtés sans que `features/` dépende de `app/`.
 *
 * Les couleurs sont en hex brut : un client email ne lit ni variables CSS ni
 * classes Tailwind, seul du style inline survit au nettoyage HTML des
 * webmails (dérogation volontaire à la règle « jamais de hex brut »,
 * CLAUDE.md §7).
 */
export function ProspectEmailTemplate({ body }: ProspectEmailTemplateProps) {
  return (
    <html lang="fr">
      {/* eslint-disable-next-line @next/next/no-head-element -- document HTML autonome pour un email, pas une page Next : la règle App Router ne s'applique pas ici. */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          .email-body p { margin: 0 0 14px; }
          .email-body p:last-child { margin-bottom: 0; }
          .email-body ul, .email-body ol { margin: 0 0 14px; padding-left: 20px; }
          .email-body strong { font-weight: 700; }
          .email-body em { font-style: italic; }
          .email-body u { text-decoration: underline; }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          padding: "32px 16px",
          backgroundColor: "#F5EFE6",
          fontFamily: FONT_UI,
        }}
      >
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{
            maxWidth: 600,
            margin: "0 auto",
            backgroundColor: "#FFFCF7",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #E9E1D4",
          }}
        >
          <tbody>
            <tr>
              <td style={{ backgroundColor: "#43142A", padding: "24px 32px" }}>
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    color: "#FFFCF7",
                  }}
                >
                  Leadflux
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "32px" }}>
                <div
                  className="email-body"
                  style={{ fontSize: 15, lineHeight: 1.6, color: "#23181C" }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "20px 32px",
                  borderTop: "1px solid #E9E1D4",
                }}
              >
                <span style={{ fontSize: 12, lineHeight: 1.5, color: "#77656C" }}>
                  Envoyé via Leadflux, agent de prospection d&apos;OxIAgen.
                  Aucun envoi n&apos;est automatique : cet email est toujours
                  relu et validé par un humain avant de partir.
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
