import { pgTable, uuid, text, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./authSchema";

/**
 * Reglages cle/valeur par utilisateur (relation one-to-many depuis user) :
 * une ligne = un parametre (ex. key="logo", value="<url>" ; key="prompt_system",
 * value peut devenir un objet structure demain). value en jsonb plutot que
 * text : chaque cle porte une forme differente, jsonb evite une migration
 * si une valeur future devient un objet/tableau plutot qu'une simple chaine.
 * Generique plutot qu'une colonne par parametre, pour ajouter un nouveau
 * reglage sans migration. Unique sur (userId, key) : un utilisateur n'a
 * qu'une valeur active par cle.
 */
export const settings = pgTable(
  "settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: jsonb("value"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("settings_user_key_uidx").on(table.userId, table.key)],
);

export type SettingsSqlInfer = typeof settings.$inferSelect;
export type SettingsSqlInsert = typeof settings.$inferInsert;
