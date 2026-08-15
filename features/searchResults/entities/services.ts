import { SearchResultSqlInfer } from "@/db/schemas"
import { CreateSearchResultDto } from "../dto/schema"
import { SearchResultKey } from "./repository"


export type SearchResultServices = {
    create: (searchResult: CreateSearchResultDto) => Promise<SearchResultSqlInfer>
    collections: (query: any) => Promise<SearchResultSqlInfer[]>
    update: (searchResult: Partial<SearchResultSqlInfer> & SearchResultKey) => Promise<SearchResultSqlInfer>
    delete: (key: SearchResultKey) => Promise<void>
    deleteMultiple: (keys: SearchResultKey[]) => Promise<void>
    truncate: () => Promise<void>

}
