import { CompanySqlInfer, CompanySqlInsert } from "@/db/schemas"




export interface ICompanyReadRepository {
    get: (id: string) => Promise<CompanySqlInfer>
    find: (query: any) => Promise<CompanySqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface ICompanyWriteRepository {
    create: (company: CompanySqlInsert) => Promise<CompanySqlInfer>
    update: (company: Partial<CompanySqlInfer>) => Promise<CompanySqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
