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
 * Vocabulaire des mots-cles, dedupliquee une fois pour toutes. Table plutot que
 * text[] sur companies : la recherche avancee doit filtrer et compter des
 * facettes (« combien d'entreprises taguees consulting »), ce qu'un tableau
 * Postgres fait mal.
 */
export const keywords = pgTable(
  "keywords",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Libelle affiche, tel que recu la premiere fois. */
    label: text("label").notNull(),
    /** Cle de dedup normalisee : « Consulting » et « consulting » = 1 ligne. */
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("keywords_slug_idx").on(table.slug)],
);

export const companyKeywords = pgTable(
  "company_keywords",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    keywordId: uuid("keyword_id")
      .notNull()
      .references(() => keywords.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.keywordId] }),
    // Sens de lecture de la recherche avancee : toutes les entreprises d'un mot-cle.
    index("company_keywords_keyword_id_idx").on(table.keywordId),
  ],
);

export type KeywordSqlInfer = typeof keywords.$inferSelect
export type KeywordSqlInsert = typeof keywords.$inferInsert


