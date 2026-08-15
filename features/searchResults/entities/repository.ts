import { SearchResultSqlInfer, SearchResultSqlInsert } from "@/db/schemas"




/**
 * search_results n'a pas d'id de substitution : sa cle primaire est le couple
 * (search_id, prospect_id). Toutes les operations cibles s'appuient donc sur
 * cette cle composite plutot que sur un id string comme les autres features.
 */
export type SearchResultKey = {
    searchId: string
    prospectId: string
}

export interface ISearchResultReadRepository {
    get: (key: SearchResultKey) => Promise<SearchResultSqlInfer>
    find: (query: any) => Promise<SearchResultSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface ISearchResultWriteRepository {
    create: (searchResult: SearchResultSqlInsert) => Promise<SearchResultSqlInfer>
    update: (searchResult: Partial<SearchResultSqlInfer> & SearchResultKey) => Promise<SearchResultSqlInfer>
    delete: (key: SearchResultKey) => Promise<void>
    deleteMany: (keys: SearchResultKey[]) => Promise<void>
    truncate: () => Promise<void>

}
