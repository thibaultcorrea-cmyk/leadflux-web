import { db } from "@/db"
import { knowledgeBase, KnowledgeBaseSqlInfer, KnowledgeBaseSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { IKnowledgeBaseWriteRepository } from "../entities/repository"



export const KnowledgeBaseWriteRepositoriesImpl: IKnowledgeBaseWriteRepository = {
    create: async (data: KnowledgeBaseSqlInsert) => {
        const [result] = await db.insert(knowledgeBase).values(data).returning()
        return result
    },

    update: async (data: Partial<KnowledgeBaseSqlInfer>): Promise<KnowledgeBaseSqlInfer> => {
        const [result] = await db.update(knowledgeBase).set({
            ...data,
        }).where(eq(knowledgeBase.id, data.id!)).returning()
        return result
    },

    delete: async (id: string) => {
        await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(knowledgeBase).where(inArray(knowledgeBase.id, ids))
    },

    truncate: async () => {
        await db.delete(knowledgeBase)
    },
}
