import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { files } from "./files";
import { user } from "./authSchema";

/**
 * Le traitement (extraction + decoupage en passages) tourne cote n8n
 * (CLAUDE.md §8, point 1) : une ligne existe des l'enregistrement du fichier,
 * mais total_indexed/count_words restent nuls tant que le webhook n8n,
 * recu via une route API Next, n'a pas renvoye son resultat.
 */
export const KNOWLEDGE_BASE_STATUSES = ["processing", "indexed", "error"] as const;
export type KnowledgeBaseStatusValue = (typeof KNOWLEDGE_BASE_STATUSES)[number];

/**
 * Une version du PDF de connaissance client. Jamais ecrasee : chaque
 * enregistrement cree une nouvelle ligne (meme principe que emailVersions,
 * cf. emails.ts) plutot que d'ecraser la precedente, pour que les emails deja
 * generes gardent la trace exacte de la base utilisee a leur redaction
 * (cf. emails.knowledgeBaseId, restrict sur la suppression).
 */
export const knowledgeBase = pgTable(
  "knowledge_base",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Identifiant technique unique, ex. "version-1699999999". */
    name: text("name").notNull().unique(),
    /** Non utilise pour l'instant, reserve a un usage a venir. */
    description: text("description"),

    fileId: uuid("file_id")
      .notNull()
      .unique()
      .references(() => files.id, { onDelete: "cascade" }),

    /** Utilisateur ayant declenche cette version. Nullable : la version doit survivre a la suppression du compte. */
    indexedBy: text("indexed_by").references(() => user.id, {
      onDelete: "set null",
    }),

    status: text("status", { enum: KNOWLEDGE_BASE_STATUSES })
      .default("processing")
      .notNull(),
    /** Motif d'echec si status = "error". */
    errorMessage: text("error_message"),

    /** Nombre de passages decoupes par n8n. Nul tant que status != "indexed". */
    totalIndexed: integer("total_indexed"),
    countWords: integer("count_words"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("knowledge_base_status_idx").on(table.status)],
);

export type KnowledgeBaseSqlInfer = typeof knowledgeBase.$inferSelect;
export type KnowledgeBaseSqlInsert = typeof knowledgeBase.$inferInsert;
