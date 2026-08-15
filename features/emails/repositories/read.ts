import { db } from "@/db"
import { emails, emailVersions } from "@/db/schemas"
import { asc, desc, eq, inArray } from "drizzle-orm"
import { IEmailReadRepository } from "../entities/repository"
import { Email, EmailVersion } from "../entities/type"

/**
 * Assemble la forme d'affichage (entities/type.ts) a partir des lignes SQL.
 * lastActivityLabel est normalement calcule cote front (libelle relatif,
 * jamais stocke) ; faute d'un tel calcul ici, on renvoie l'ISO.
 */
const emailFromRow = (
    row: typeof emails.$inferSelect,
    versions: (typeof emailVersions.$inferSelect)[],
): Email => ({
    id: row.id,
    contactName: row.prospectName,
    contactRole: row.prospectJob ?? "",
    company: row.prospectCompany ?? "",
    city: row.prospectLocation ?? "",
    recipient: row.prospectEmail,
    status: row.status,
    lastActivityAt: row.lastActivityAt.toISOString(),
    lastActivityLabel: row.lastActivityAt.toISOString(),
    versions: versions.map((version): EmailVersion => ({
        id: version.id,
        subject: version.subject,
        body: version.body,
        generatedAt: version.generatedAt.toISOString(),
        knowledgeVersion: version.knowledgeVersion ?? "",
    })),
})

export const EmailReadRepositoriesImpl: IEmailReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(emails).where(eq(emails.id, id))

        if (!result) {
            throw new Error("Email not found")
        }

        return result
    },
    find: async (query: any) => {
        const emailRows = await db.select().from(emails).orderBy(desc(emails.lastActivityAt))

        if (emailRows.length === 0) {
            return []
        }

        const versionRows = await db.select().from(emailVersions)
            .where(inArray(emailVersions.emailId, emailRows.map((row) => row.id)))
            .orderBy(asc(emailVersions.generatedAt))

        return emailRows.map((row) =>
            emailFromRow(row, versionRows.filter((version) => version.emailId === row.id)),
        )
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
