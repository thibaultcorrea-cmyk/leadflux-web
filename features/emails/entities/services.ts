import { EmailSqlInfer } from "@/db/schemas"
import { CreateEmailDto, UpdateEmailContentDto, UpdateEmailStatusDto } from "../dto/schema"
import { Email, GenerateManyResult } from "./type"


export type EmailProspectsServices = {
    create: (email: CreateEmailDto) => Promise<EmailSqlInfer>
    generate: (email: CreateEmailDto) => Promise<Email>
    generateMany: (email: CreateEmailDto[]) => Promise<GenerateManyResult>
    send: (id: string) => Promise<void>
    sendMany: (ids: string[]) => Promise<void>
    regenerate: (id: string) => Promise<any>
    regenerateMany: (ids: string[]) => Promise<GenerateManyResult>
    collections: (query: any) => Promise<any[]>
    update: (email: Partial<EmailSqlInfer>) => Promise<EmailSqlInfer>
    updateEmailContent: (email: Partial<UpdateEmailContentDto>) => Promise<EmailSqlInfer>
    updateStatus: (input: UpdateEmailStatusDto) => Promise<EmailSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
