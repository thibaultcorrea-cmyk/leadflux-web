import { EmailVersionSqlInfer, EmailVersionSqlInsert } from "@/db/schemas"




export interface IEmailVersionReadRepository {
    get: (id: string) => Promise<EmailVersionSqlInfer>
    find: (query: any) => Promise<EmailVersionSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface IEmailVersionWriteRepository {
    create: (emailVersion: EmailVersionSqlInsert) => Promise<EmailVersionSqlInfer>
    update: (emailVersion: Partial<EmailVersionSqlInfer>) => Promise<EmailVersionSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
