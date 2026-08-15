import { CreateSearchResultDto } from "./dto/schema"
import { searchResultValidator } from "./dto/validator"
import { SearchResultWriteRepositoriesImpl } from "./repositories/write"
import { SearchResultServices } from "./entities/services"



export const SearchResultServicesImpl: SearchResultServices = {
    create: async (input: CreateSearchResultDto) => {
        const validated = searchResultValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        return SearchResultWriteRepositoriesImpl.create(validated.data)
    },

    collections: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    update: async (searchResult) => {
        throw new Error("Method not implemented.")
    },
    delete: async (key) => {
        throw new Error("Method not implemented.")
    },
    deleteMany: async (keys) => {
        throw new Error("Method not implemented.")
    },
    clear: async () => {
        await SearchResultWriteRepositoriesImpl.truncate();
    },
}
