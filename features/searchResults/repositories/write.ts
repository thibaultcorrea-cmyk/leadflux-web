import { db } from "@/db"
import { searchResults, SearchResultSqlInfer, SearchResultSqlInsert } from "@/db/schemas"
import { and, eq, or } from "drizzle-orm"
import { ISearchResultWriteRepository } from "../entities/repository"



/**
 * create fait un onConflictDoUpdate sur (search_id, prospect_id) : si le meme
 * prospect ressort deux fois dans le meme lot de resultats, on rafraichit sa
 * position sans toucher archived_at (« Retirer des resultats » reste local et
 * non destructif, cf. db/schemas/searches.ts).
 */
export const SearchResultWriteRepositoriesImpl: ISearchResultWriteRepository = {
    create: async (data: SearchResultSqlInsert) => {
        const [result] = await db.insert(searchResults).values(data)
            .onConflictDoUpdate({
                target: [searchResults.searchId, searchResults.prospectId],
                set: { position: data.position },
            })
            .returning()

        return result
    },

    update: async (data: Partial<SearchResultSqlInfer> & { searchId: string; prospectId: string }): Promise<SearchResultSqlInfer> => {
        const { searchId, prospectId, ...rest } = data

        const [result] = await db.update(searchResults).set({
            ...rest,

        }).where(and(eq(searchResults.searchId, searchId), eq(searchResults.prospectId, prospectId))).returning()

        return result
    },

    delete: async ({ searchId, prospectId }) => {
        await db.delete(searchResults).where(and(eq(searchResults.searchId, searchId), eq(searchResults.prospectId, prospectId)))
    },
    deleteMany: async (keys) => {
        if (keys.length === 0) {
            return
        }

        await db.delete(searchResults).where(
            or(...keys.map((key) => and(eq(searchResults.searchId, key.searchId), eq(searchResults.prospectId, key.prospectId)))),
        )
    },

    truncate: async () => {
        await db.delete(searchResults)
    },
}
