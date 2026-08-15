import {
  pgTable,
  uuid,
  text,
  jsonb,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./authSchema";

/**
 * Les trois seuls statuts du produit : aucun envoi n'est automatique (CLAUDE.md §3).
 * Valeurs en anglais comme le reste du schema ; le mapping vers les libelles
 * francais du front (brouillon/envoye/repondu) se fait dans features/emails.
 */
export const EMAIL_STATUSES = ["draft", "sent", "replied"] as const;
export type EmailStatusValue = (typeof EMAIL_STATUSES)[number];

/**
 * Table racine du domaine email : le suivi d'une prospection par email. Pas de
 * relation vers prospects : les donnees du contact ne sont pas stockees cote
 * prospect pour cette table, elles sont dupliquees ici (prospect_name,
 * prospect_job, prospect_email).
 *
 * Le statut est denormalise (plutot que deduit de sent_at/replied_at a chaque
 * lecture) pour que les compteurs des onglets de l'ecran Emails restent de
 * simples COUNT ... GROUP BY status. sent_at/replied_at portent l'audit des
 * transitions et alimentent last_activity_at.
 */
export const emails = pgTable(
  "emails",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    prospectName: text("prospect_name").notNull(),
    prospectJob: text("prospect_job"),
    prospectCompany: text("prospect_company"),
    prospectEmail: text("prospect_email").notNull(),
    prospectLocation: text("prospect_location"),
    /** Consentement de prospection recueilli pour ce contact (obligation RGPD). */
    prospectingConsent: boolean("prospecting_consent")
      .default(true)
      .notNull(),

    status: text("status", { enum: EMAIL_STATUSES })
      .default("draft")
      .notNull(),

    /** Utilisateur ayant clique "Valider et envoyer" : seule etape qui envoie reellement. */
    validatedBy: text("validated_by").references(() => user.id, {
      onDelete: "set null",
    }),
    sentAt: timestamp("sent_at"),
    repliedAt: timestamp("replied_at"),
    /**
     * Id du thread Gmail, retourne par le webhook n8n qui effectue l'envoi
     * reel. Preuve de tracabilite de l'envoi : sans lui, "sent" n'est qu'une
     * affirmation ; avec lui, on peut retrouver le thread pour verifier une
     * reponse.
     */
    threadId: text("thread_id"),

    /**
     * Derniere activite (nouvelle version generee, envoi, reponse) : mise a
     * jour par la couche services a chaque transition, pas de trigger SQL.
     * Sert au tri de la colonne "Derniere activite" ; le libelle relatif
     * ("Il y a 12 min") reste calcule a l'affichage, jamais stocke.
     */
    lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("emails_prospect_email_idx").on(table.prospectEmail),
    index("emails_status_idx").on(table.status),
  ],
);

export type EmailSqlInfer = typeof emails.$inferSelect;
export type EmailSqlInsert = typeof emails.$inferInsert;

/**
 * Une generation de l'email. Chaque regeneration cree une ligne plutot que
 * d'ecraser la precedente : c'est ce qui rend l'Annuler / Retablir de l'apercu
 * possible (CLAUDE.md §3). De la plus ancienne a la plus recente via
 * generated_at ; la derniere est la version courante.
 */
export const emailVersions = pgTable(
  "email_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    emailId: uuid("email_id")
      .notNull()
      .references(() => emails.id, { onDelete: "cascade" }),

    subject: text("subject").notNull(),
    /** Un element par paragraphe, fidele au rendu de l'apercu. */
    body: jsonb("body").$type<string[]>().notNull(),

    /**
     * Libelle de version du PDF de connaissance client ("12/07/2026"), texte
     * libre en attendant que le stockage du PDF soit tranche (CLAUDE.md §8,
     * point 5). A remplacer par une reference vers une table de versions du
     * PDF le jour ou ce point est arrete.
     */
    knowledgeVersion: text("knowledge_version"),

    generatedAt: timestamp("generated_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("email_versions_email_id_idx").on(table.emailId),
  ],
);

export type EmailVersionSqlInfer = typeof emailVersions.$inferSelect;
export type EmailVersionSqlInsert = typeof emailVersions.$inferInsert;
