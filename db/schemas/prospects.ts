import {
  pgTable,
  uuid,
  boolean,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { persons } from "./persons";
import { companies } from "./companies";

/** Payload brut d'un lead, tel que renvoye par la source de prospection. */
export type ProspectSourcePayload = {
  person: { name: string; email: string; jobTitle?: string };
  company: {
    name: string;
    industry?: string;
    description?: string;
    keywords?: string[];
    size?: string;
    technologies?: string[];
    address?: { city?: string; country?: string; zip?: string };
  };
};

/**
 * Table racine du domaine : un lead, c'est-a-dire l'assemblage d'une personne
 * et d'une entreprise.
 *
 * Regle de partage : persons et companies decrivent ce que les entites SONT
 * (identite stable, dedupliquee), prospects decrit le fait qu'on les PROSPECTE
 * (lien, etat, dates). Aucune colonne ne vit des deux cotes.
 *
 * Adresse, mots-cles et technologies ne sont pas re-accroches ici : ils
 * appartiennent a l'entreprise et s'atteignent via company, sinon deux chemins
 * meneraient a la meme information sans regle pour les arbitrer.
 */
export const prospects = pgTable(
  "prospects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id")
      .notNull()
      .references(() => persons.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),

    /** Payload source integral, conserve une seule fois, sur la racine. */
    rawPayload: jsonb("raw_payload").$type<ProspectSourcePayload>(),
    /** Derniere fois que la source a re-remonte ce lead. */
    lastSourcedAt: timestamp("last_sourced_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    // Cle d'idempotence du pipeline : un re-sourcing fait un onConflictDoUpdate
    // qui rafraichit raw_payload sans creer de doublon ni ecraser is_kept.
    uniqueIndex("prospects_person_company_idx").on(
      table.personId,
      table.companyId,
    ),
    index("prospects_company_id_idx").on(table.companyId),

  ],
);


export type ProspectSqlInfer = typeof prospects.$inferSelect