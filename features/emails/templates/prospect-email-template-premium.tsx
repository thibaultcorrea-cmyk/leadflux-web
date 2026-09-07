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
 * Icône `Radar` de lucide-react, recopiée en SVG brut plutôt qu'importée.
 * Depuis `lucide-react@1.27`, les icônes sont tagguées `"use client"` : les
 * appeler depuis `render()` (build Node de `@react-email/render`, utilisé
 * par `sendEmail` côté serveur) plante avec « Attempted to call the default
 * export ... from the server, but it's on the client », `render()` ne
 * passant pas par le pipeline RSC de Next qui sait résoudre ces références.
 * Un `<svg>`/`<path>` brut n'a pas ce problème : ce sont des éléments
 * intrinsèques, ni client ni serveur. Tracé identique à l'original.
 */
function RadarMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#23181C"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
      <path d="M4 6h.01" />
      <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
      <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
      <path d="M12 18h.01" />
      <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
      <circle cx={12} cy={12} r={2} />
      <path d="m13.41 10.59 5.66-5.66" />
    </svg>
  );
}

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
 * - Repère de marque (icône `Radar`, cohérent avec la sidebar de l'app,
 *   recopiée en SVG brut — voir `RadarMark` ci-dessous) et
 *   un sur-titre court sous le nom, dans le bandeau `primary-700`.
 * - Rythme d'espacement plus généreux (`shadow-md`/`radius-xl` de
 *   design.md §3, réservés aux cartes mises en avant) et accent de couleur
 *   sur les passages en gras du corps (signature).
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
              <td style={{ backgroundColor: "#43142A", padding: "36px 40px" }}>
                <table role="presentation" cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: 12, verticalAlign: "middle" }}>
                        <table
                          role="presentation"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            width: 34,
                            height: 34,
                            backgroundColor: "#D89727",
                            borderRadius: 9999,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td align="center" valign="middle">
                                <RadarMark />
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                        <div
                          style={{
                            marginTop: 2,
                            fontFamily: FONT_UI,
                            fontSize: 11,
                            fontWeight: 500,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#F0C87A",
                          }}
                        >
                          Agent de prospection
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
                style={{
                  padding: "24px 40px 28px",
                  borderTop: "1px solid #E9E1D4",
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
      </body>
    </html>
  );
}
