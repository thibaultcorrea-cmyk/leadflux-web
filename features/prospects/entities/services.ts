import { ProspectSqlInfer } from "@/db/schemas"
import { CreateProspectDto } from "../dto/schema"
import { ManyOperationResult } from "@/features/emails/entities/type"

export type ProspectServices = {
    create: (prospect: CreateProspectDto) => Promise<ProspectSqlInfer>
    collections: (query: any) => Promise<any[]>
    update: (prospect: Partial<any>) => Promise<any>
    find: (id: string) => Promise<any>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<ManyOperationResult>
    clear: () => Promise<void>
    search: (query: any) => Promise<any[]>
    markAsProspected: (id: string) => Promise<ProspectSqlInfer>

}
