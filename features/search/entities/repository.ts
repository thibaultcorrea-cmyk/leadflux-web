import { ProspectSqlInfer, SearchesSqlInfer, SearchesSqlInsert } from "@/db/schemas"





export interface ISearchReadRepository {
    get: (id: string) => Promise<SearchesSqlInfer>
    find: (query: any) => Promise<any[]>
    count?: (query: any) => Promise<number>

}

export interface ISearchWriteRepository {
    create: (prospect: SearchesSqlInsert) => Promise<SearchesSqlInfer>
    update: (prospect: Partial<SearchesSqlInfer>) => Promise<SearchesSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (id: string[]) => Promise<void>
    truncate: () => Promise<void>

}


