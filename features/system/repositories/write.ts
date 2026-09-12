import { sql } from "drizzle-orm"
import { db } from "@/db"
import { ISystemWriteRepository } from "../entities/repository"

/**
 * Liste exhaustive des tables physiques (cf. db/migrations), y compris les
 * tables d'auth (user, session, account, verification). Hard reset total :
 * exception assumee aux regles habituelles (raw SQL, cross-feature) pour
 * repartir d'une base vide en developpement/tests.
 */
const ALL_TABLES = [
    "user",
    "session",
    "account",
    "verification",
    "health_check",
    "industries",
    "addresses",
    "companies",
    "company_keywords",
    "keywords",
    "company_technologies",
    "technologies",
    "persons",
    "prospects",
    "search_results",
    "searches",
    "email_versions",
    "emails",
    "settings",
    "files",
    "knowledge_base",
] as const

export const SystemWriteRepositoriesImpl: ISystemWriteRepository = {
    truncate: async () => {
        const identifiers = ALL_TABLES.map((table) => sql.identifier(table))

        await db.execute(sql`TRUNCATE TABLE ${sql.join(identifiers, sql`, `)} RESTART IDENTITY CASCADE`)
    },
}
