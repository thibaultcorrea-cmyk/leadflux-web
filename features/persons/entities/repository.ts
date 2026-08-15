import { PersonSqlInfer, PersonSqlInsert } from "@/db/schemas"




export interface IPersonReadRepository {
    get: (id: string) => Promise<PersonSqlInfer>
    find: (query: any) => Promise<PersonSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface IPersonWriteRepository {
    create: (person: PersonSqlInsert) => Promise<PersonSqlInfer>
    update: (person: Partial<PersonSqlInfer>) => Promise<PersonSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
