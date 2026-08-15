import { db } from "@/db"
import { searches, SearchesSqlInfer, SearchesSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { ISearchWriteRepository } from "../entities/repository"



export const SearchWriteRepositoriesImpl: ISearchWriteRepository = {
    create: async (data: SearchesSqlInsert) => {
        const dt = new Date()

        const [result] = await db.insert(searches).values({
            ...data,
            launchedAt: dt,
        }).returning()

        return result
    },

    update: async (data: Partial<SearchesSqlInfer>): Promise<SearchesSqlInfer> => {
        const [result] = await db.update(searches).set({
            ...data,

        }).where(eq(searches.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(searches).where(eq(searches.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(searches).where(inArray(searches.id, ids))
    },

    truncate: async () => {
        await db.delete(searches)
    },
}