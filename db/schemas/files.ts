import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * Fichier physique stocke (PDF, DOCX, Markdown, TXT...). Generique et sans
 * connaissance de son usage : c'est knowledgeBase qui reference un fichier
 * via file_id, jamais l'inverse, pour rester reutilisable par d'autres
 * features plus tard sans dupliquer cette table.
 */
export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalName: text("original_name").notNull(),
  /** Taille en octets. */
  size: integer("size").notNull(),
  /** Type MIME (ex. "application/pdf"). */
  type: text("type").notNull(),
  extension: text("extension").notNull(),
  /** Cle de stockage (MinIO) ou chemin, selon la strategie de stockage retenue. */
  path: text("path").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type FileSqlInfer = typeof files.$inferSelect;
export type FileSqlInsert = typeof files.$inferInsert;
