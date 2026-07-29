import { CriteriaBar } from "./components/criteria-bar";
import { ProspectsHeader } from "./components/prospects-header";
import { ProspectsTablePanel } from "./components/table/prospects-table-panel";
import { prospects, searchCriteria } from "./mocks/prospects";

/**
 * Résultats d'un sourcing (maquette « Recherche V4 — Résultats »).
 *
 * C'est bien l'onglet Prospects qui est actif : un résultat de sourcing est une
 * liste de prospects, et la recherche n'a plus d'onglet propre (CLAUDE.md §3).
 *
 * Les données viennent d'un mock : le branchement au sourcing n8n et le modèle
 * Drizzle ne sont pas encore arrêtés (CLAUDE.md §8).
 */
export default function ProspectsPage() {
  return (
    <div className="flex flex-col gap-5 p-6 lg:p-8">
      <ProspectsHeader subtitle="Résultats du sourcing lancé aujourd'hui à 10h42" />
      <CriteriaBar criteria={searchCriteria} />
      <ProspectsTablePanel data={prospects} />
    </div>
  );
}
