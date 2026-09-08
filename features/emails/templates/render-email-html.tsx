import { render } from "@react-email/render";

import { ProspectEmailTemplatePremium } from "./prospect-email-template-premium";

/**
 * Point d'entrée de rendu unique pour le template actif (la variante
 * premium). `@react-email/render` expose des builds séparés (navigateur,
 * Node, edge...) choisis automatiquement selon le contexte d'import : ce
 * même appel produit un HTML identique depuis l'aperçu client
 * (`useEmailPreviewHtml.tsx`, build navigateur) et depuis un futur envoi
 * côté serveur (build Node, quand CLAUDE.md §8 point 1 sera tranché) — pas
 * besoin d'un endpoint HTTP dédié entre les deux, ce sont deux appels de la
 * même fonction dans le même process.
 */
export function renderProspectEmailHtml(body: string): Promise<string> {
  return render(<ProspectEmailTemplatePremium body={body} />);
}
