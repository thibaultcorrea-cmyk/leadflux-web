import { EmailSqlInfer, EmailVersionSqlInfer } from "@/db/schemas"
import { CreateEmailByProspectIdDto, CreateEmailDto, UpdateEmailContentDto, UpdateEmailStatusDto } from "../dto/schema"
import { Email, EmailVersion, GenerateManyResult } from "./type"
import { AgentEmailSendResult } from "@/features/agent/email/entities/agentEmail"


export type EmailProspectsServices = {
    create: (email: CreateEmailDto) => Promise<EmailSqlInfer>
    generate: (email: CreateEmailByProspectIdDto) => Promise<Email>
    generateMany: (email: CreateEmailByProspectIdDto[]) => Promise<GenerateManyResult>
    send: (id: string) => Promise<AgentEmailSendResult>
    sendMany: (ids: string[]) => Promise<void>
    regenerate: (id: string) => Promise<EmailVersionSqlInfer>
    regenerateMany: (ids: string[]) => Promise<GenerateManyResult>
    collections: (query: any) => Promise<any[]>
    update: (email: Partial<EmailSqlInfer>) => Promise<EmailSqlInfer>
    updateEmailContent: (email: Partial<UpdateEmailContentDto>) => Promise<EmailSqlInfer>
    updateStatus: (input: UpdateEmailStatusDto) => Promise<EmailSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
