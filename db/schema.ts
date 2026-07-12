import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";

// Schema placeholder: le modele de donnees (prospects, emails, statuts) sera
// defini une fois le cahier des charges Leadflux valide. Cette table sert
// uniquement a verifier que la connexion et les migrations Drizzle fonctionnent.
export const healthCheck = pgTable("health_check", {
  id: serial("id").primaryKey(),
  checkedAt: timestamp("checked_at").notNull().defaultNow(),
});
