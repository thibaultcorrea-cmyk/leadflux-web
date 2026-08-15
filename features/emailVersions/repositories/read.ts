import { db } from "@/db"
import { emailVersions } from "@/db/schemas"
import { asc, eq } from "drizzle-orm"
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
            .orderBy(asc(emailVersions.generatedAt))
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
