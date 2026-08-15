import { PersonSqlInfer } from "@/db/schemas"
import { CreatePersonDto } from "../dto/schema"


export type PersonServices = {
    create: (person: CreatePersonDto) => Promise<PersonSqlInfer>
    collections: (query: any) => Promise<PersonSqlInfer[]>
    update: (person: Partial<PersonSqlInfer>) => Promise<PersonSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
