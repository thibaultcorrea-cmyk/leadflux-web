import { db } from "@/db"
import { emailVersions } from "@/db/schemas"
import { asc, desc, eq } from "drizzle-orm"
import { IEmailVersionReadRepository } from "../entities/repository"

export const EmailVersionReadRepositoriesImpl: IEmailVersionReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(emailVersions).where(eq(emailVersions.id, id))

        if (!result) {
            throw new Error("Email version not found")
        }

        return result
    },
    find: async (query: { emailId: string }) => {
        return db.select().from(emailVersions)
            .where(eq(emailVersions.emailId, query.emailId))
            .orderBy(desc(emailVersions.createdAt)) //TODO add limit
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    getLatestVersion: async (emailId: string) => {
        const [result] = await db.select().from(emailVersions).where(eq(emailVersions.emailId, emailId)).orderBy(desc(emailVersions.createdAt)).limit(1)

        if (!result) {
            throw new Error("Email version not found")
        }
        return result
    },


}
