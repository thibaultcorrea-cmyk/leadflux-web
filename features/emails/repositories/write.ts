import { db } from "@/db"
import { emails, EmailSqlInfer, EmailSqlInsert } from "@/db/schemas"
import { and, eq, inArray } from "drizzle-orm"
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

    markRepliedByThreadIds: async (replies: { threadId: string; repliedAt: Date }[]) => {
        if (replies.length === 0) {
            return []
        }
        return db.transaction(async (tx) => {
            const updated: EmailSqlInfer[] = []
            for (const { threadId, repliedAt } of replies) {
                const [result] = await tx.update(emails)
                    .set({ status: "replied", repliedAt, lastActivityAt: repliedAt })
                    .where(and(eq(emails.threadId, threadId), eq(emails.status, "sent")))
                    .returning()
                if (result) {
                    updated.push(result)
                }
            }
            return updated
        })
    },
}
