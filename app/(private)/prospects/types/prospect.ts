/**
 * Un prospect issu d'un sourcing. Modèle d'écran uniquement : le schéma Drizzle
 * réel reste à concevoir (CLAUDE.md §8, point 8).
 */
export type Prospect = {
  id: string;
  company: string;
  /** Décideur identifié pour l'entreprise. */
  contactName: string;
  contactRole: string;
  sector: string;
  city: string;
  /** Libellé affiché de la tranche d'effectif, ex. « 3-8 salariés ». */
  headcountLabel: string;
  /** Borne basse de la tranche : sert au tri, jamais à l'affichage. */
  headcountMin: number;
  headcountMax: number;

};

/** Critère de la recherche en cours, affiché en puce au-dessus des résultats. */
export type SearchCriterion = {
  id: string;
  label: string;
};
