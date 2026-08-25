import { ProspectSqlInfer, ProspectSqlInsert } from "@/db/schemas"
import { TProspectWithRelations } from "./type"





export interface IProspectReadRepository {
    get: (id: string) => Promise<ProspectSqlInfer>
    getWithRelations: (id: string) => Promise<TProspectWithRelations>
    find: (query: any) => Promise<ProspectSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface IProspectWriteRepository {
    create: (prospect: ProspectSqlInsert) => Promise<ProspectSqlInfer>
    update: (prospect: Partial<ProspectSqlInfer>) => Promise<ProspectSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}


