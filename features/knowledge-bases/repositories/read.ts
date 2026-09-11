import { db } from "@/db"
import { knowledgeBase } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { IKnowledgeBaseReadRepository } from "../entities/repository"

export const KnowledgeBaseReadRepositoriesImpl: IKnowledgeBaseReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(knowledgeBase).where(eq(knowledgeBase.id, id))

        if (!result) {
            throw new Error("Knowledge base not found")
        }

        return result
    },
    find: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
