import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { companies } from "./companies";

/**
 * Stack detectee sur l'entreprise, facette de la recherche avancee
 * (« entreprises qui utilisent Salesforce »).
 *
 * Table distincte de keywords plutot qu'une table tags a colonne kind : un nom
 * de produit et un mot-cle semantique n'ont pas la meme regle de normalisation,
 * et fusionner les deux ferait payer un WHERE kind = ... a chaque requete.
 */
export const technologies = pgTable(
  "technologies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Nom de produit affiche tel quel : « Salesforce », jamais « salesforce ». */
    name: text("name").notNull(),
    /** Cle de dedup insensible a la casse : « Salesforce » et « SalesForce » = 1 ligne. */
    slug: text("slug").notNull(),
    /** Famille (crm, analytics, comm...). Absente de la source, remplie plus tard. */
    category: text("category"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("technologies_slug_idx").on(table.slug)],
);

export const companyTechnologies = pgTable(
  "company_technologies",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    technologyId: uuid("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.technologyId] }),
    index("company_technologies_technology_id_idx").on(table.technologyId),
  ],
);
