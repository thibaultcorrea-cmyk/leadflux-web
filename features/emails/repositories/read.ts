import { db } from "@/db"
import { emails, emailVersions } from "@/db/schemas"
import { asc, desc, eq, inArray } from "drizzle-orm"
import { IEmailReadRepository } from "../entities/repository"
import { emailFromRow } from "../factory/email-factory"



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
