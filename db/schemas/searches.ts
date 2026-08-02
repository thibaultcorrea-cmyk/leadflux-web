import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { prospects } from "./prospects";
import { user } from "./authSchema";

/** Les cinq criteres de la modale de recherche, tels que saisis. */
export type SearchCriteriaPayload = {
  sector?: string;
  location?: string;
  jobTitle?: string;
  headcount?: { min?: number; max?: number };
  revenue?: { min?: number; max?: number };
};

/**
 * Un sourcing lance. Alimente la barre de criteres de la page de resultats et
 * le widget « Dernieres recherches » du Tableau.
 */
export const searches = pgTable("searches", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  /**
   * Bloc de criteres en jsonb : ils s'affichent d'un tenant et ne sont jamais
   * requetes champ par champ, cinq colonnes seraient du sur-typage.
   */
  criteria: jsonb("criteria").$type<SearchCriteriaPayload>().notNull(),
  /** Rendu pret a afficher : « Conseil · 3-15 sal. · Paris ». Denormalise volontairement. */
  criteriaLabel: text("criteria_label").notNull(),
  resultCount: integer("result_count").default(0).notNull(),
  launchedAt: timestamp("launched_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
});

/**
 * Apparition d'un prospect dans un sourcing. Un meme prospect peut ressortir de
 * plusieurs recherches sans doublon.
 */
export const searchResults = pgTable(
  "search_results",
  {
    searchId: uuid("search_id")
      .notNull()
      .references(() => searches.id, { onDelete: "cascade" }),
    prospectId: uuid("prospect_id")
      .notNull()
      .references(() => prospects.id, { onDelete: "cascade" }),
    /** Rang de pertinence renvoye par la source : ordre par defaut du tableau. */
    position: integer("position").notNull(),
    /** « Retirer des resultats » : portee locale a ce sourcing, jamais destructif. */
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.searchId, table.prospectId] }),
    index("search_results_prospect_id_idx").on(table.prospectId),
  ],
);
