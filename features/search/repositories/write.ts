import { db } from "@/db"
import { searches, SearchesTableInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"



export const SearchProspectsWriteRepositoriesImpl = {

    create: async (data: SearchesTableInsert) => {
        const dt = new Date()

        const [result] = await db.insert(searches).values({
            ...data,
            launchedAt: dt,
        }).returning()

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