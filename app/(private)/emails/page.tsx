import { EmailsHeader } from "./components/emails-header";
import { EmailsTablePanel } from "./components/table/emails-table-panel";
import { emails } from "./mocks/emails";

/**
 * Onglet Emails (maquette « Emails — Variante 3 »).
 *
 * Le suivi des réponses est intégré ici, structuré par statut par prospect :
 * pas d'onglet « Réponses » séparé, et aucun indicateur qui supposerait un
 * envoi automatique (CLAUDE.md §3).
 *
 * Les données viennent d'un mock : le modèle Drizzle et le branchement n8n ne
 * sont pas encore arrêtés (CLAUDE.md §8).
 */
export default function EmailsPage() {
  return (
    <div className="flex flex-col gap-5 p-6 lg:p-8">
      <EmailsHeader total={emails.length} />
      <EmailsTablePanel data={emails} />
    </div>
  );
}
