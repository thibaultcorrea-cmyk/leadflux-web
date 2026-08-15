import { EmailSqlInfer, EmailSqlInsert } from "@/db/schemas"




export interface IEmailReadRepository {
    get: (id: string) => Promise<EmailSqlInfer>
    find: (query: any) => Promise<any[]>
    count?: (query: any) => Promise<number>

}

export interface IEmailWriteRepository {
    create: (email: EmailSqlInsert) => Promise<EmailSqlInfer>
    update: (email: Partial<EmailSqlInfer>) => Promise<EmailSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
