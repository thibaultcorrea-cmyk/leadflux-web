import * as z from "zod"



export const SearchResultSchema = z.object({
    searchId: z.string(),
    prospectId: z.string(),
    position: z.number(),
    archivedAt: z.string().nullable(),
    createdAt: z.string(),
})

export type SearchResult = z.infer<typeof SearchResultSchema>



export const createSearchResultSchema = z.object({
    searchId: z.string().min(1, "searchId est requis"),
    prospectId: z.string().min(1, "prospectId est requis"),
    position: z.number().int().min(0, "La position doit etre positive ou nulle"),
})

export type CreateSearchResultDto = z.infer<typeof createSearchResultSchema>
