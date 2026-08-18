import { db } from "@/db"
import { emailVersions, EmailVersionSqlInfer, EmailVersionSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { IEmailVersionWriteRepository } from "../entities/repository"



export const EmailVersionWriteRepositoriesImpl: IEmailVersionWriteRepository = {
    create: async (data: EmailVersionSqlInsert) => {
        const [result] = await db.insert(emailVersions).values(data).returning()

        return result
    },

    update: async (data: Partial<EmailVersionSqlInfer>): Promise<EmailVersionSqlInfer> => {
        const [result] = await db.update(emailVersions).set({
            ...data,

        }).where(eq(emailVersions.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(emailVersions).where(eq(emailVersions.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(emailVersions).where(inArray(emailVersions.id, ids))
    },

    truncate: async () => {
        await db.delete(emailVersions)
    },
}
