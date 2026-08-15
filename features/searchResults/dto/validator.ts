import { createSearchResultSchema } from "./schema"


export const searchResultValidator = {
    validate: (data: unknown) => createSearchResultSchema.safeParse(data),
}
