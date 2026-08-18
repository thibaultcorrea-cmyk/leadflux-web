import { db } from "@/db"
import { emails, EmailSqlInfer, EmailSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { IEmailWriteRepository } from "../entities/repository"



export const EmailWriteRepositoriesImpl: IEmailWriteRepository = {
    create: async (data: EmailSqlInsert) => {
        const [result] = await db.insert(emails).values(data).returning()

        return result
    },

    update: async (data: Partial<EmailSqlInfer>): Promise<EmailSqlInfer> => {
        const [result] = await db.update(emails).set({
            ...data,

        }).where(eq(emails.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(emails).where(eq(emails.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(emails).where(inArray(emails.id, ids))
    },

    truncate: async () => {
        await db.delete(emails)
    },
}
