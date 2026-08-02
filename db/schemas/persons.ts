import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Personne physique : le decideur identifie par le sourcing.
 *
 * Table d'identite pure. Ni etat de prospection, ni company_id : le rattachement
 * a une entreprise passe par la table racine prospects, ce qui laisse la porte
 * ouverte a une meme personne prospectee au titre de deux entites.
 */
export const persons = pgTable(
  "persons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    /** email en minuscules : cle de dedup, garantit l'idempotence du sourcing. */
    emailKey: text("email_key").notNull(),
    jobTitle: text("job_title"),
    phone: text("phone"),
    linkedinUrl: text("linkedin_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("persons_email_key_idx").on(table.emailKey)],
);
