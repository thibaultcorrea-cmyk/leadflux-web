import { EmailSqlInfer } from "@/db/schemas"
import { CreateEmailDto, UpdateEmailStatusDto } from "../dto/schema"


export type EmailServices = {
    create: (email: CreateEmailDto) => Promise<EmailSqlInfer>
    collections: (query: any) => Promise<EmailSqlInfer[]>
    update: (email: Partial<EmailSqlInfer>) => Promise<EmailSqlInfer>
    updateStatus: (input: UpdateEmailStatusDto) => Promise<EmailSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
