import { db } from "@/db"
import { searchResults } from "@/db/schemas"
import { and, eq } from "drizzle-orm"
import { ISearchResultReadRepository } from "../entities/repository"

export const SearchResultReadRepositoriesImpl: ISearchResultReadRepository = {
    get: async ({ searchId, prospectId }) => {
        const [result] = await db.select().from(searchResults)
            .where(and(eq(searchResults.searchId, searchId), eq(searchResults.prospectId, prospectId)))

        if (!result) {
            throw new Error("SearchResult not found")
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
