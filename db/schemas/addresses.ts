import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Adresse d'une entreprise. Tout est nullable sauf l'id : le payload de sourcing
 * ne porte aujourd'hui que city et country, les autres champs sont prevus pour
 * une source plus riche.
 */
export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    street: text("street"),
    city: text("city"),
    /** city normalisee (minuscules, sans accents) : filtre et regroupement. */
    cityKey: text("city_key"),
    zip: text("zip"),
    region: text("region"),
    country: text("country"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("addresses_city_key_idx").on(table.cityKey)],
);
