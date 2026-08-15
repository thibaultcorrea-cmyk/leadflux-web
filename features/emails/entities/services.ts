import { EmailSqlInfer } from "@/db/schemas"
import { CreateEmailDto, UpdateEmailStatusDto } from "../dto/schema"
import { Email } from "./type"


export type EmailServices = {
    create: (email: CreateEmailDto) => Promise<EmailSqlInfer>
    generate: (email: CreateEmailDto) => Promise<string[]>
    regenerate: (id: string) => Promise<any>
    collections: (query: any) => Promise<Email[]>
    update: (email: Partial<EmailSqlInfer>) => Promise<EmailSqlInfer>
    updateStatus: (input: UpdateEmailStatusDto) => Promise<EmailSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
