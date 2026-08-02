import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Referentiel des secteurs d'activite. Alimente le badge Secteur de la liste
 * des prospects et la liste deroulante de la modale de recherche.
 *
 * La source de sourcing renvoie une chaine bruitee ("Conseil (strategie, RH, IA)")
 * conservee telle quelle dans companies.industry_raw : cette table ne contient
 * que la valeur canonique.
 */
export const sectors = pgTable(
  "sectors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Libelle canonique affiche, ex. « Conseil ». */
    name: text("name").notNull(),
    /** Cle de dedup normalisee : sans elle, « Conseil » et « conseil » creeraient deux lignes. */
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("sectors_slug_idx").on(table.slug)],
);
