import { ProspectSqlInfer } from "@/db/schemas"





export interface IProspectReadRepository {
    get: (id: string) => Promise<ProspectSqlInfer>
    find: (query: any) => Promise<ProspectSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface IProspectWriteRepository {
    create: (prospect: ProspectSqlInfer) => Promise<ProspectSqlInfer>
    update: (prospect: Partial<ProspectSqlInfer>) => Promise<ProspectSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMultiple: (id: string[]) => Promise<void>
    truncate: () => Promise<void>

}


