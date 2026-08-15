import { ProspectSqlInfer } from "@/db/schemas"
import { CreateProspectDto } from "../dto/schema"

export type ProspectServices = {
    create: (prospect: CreateProspectDto) => Promise<ProspectSqlInfer>
    collections: (query: any) => Promise<any[]>
    update: (prospect: Partial<any>) => Promise<any>
    delete: (id: string) => Promise<void>
    deleteMultiple: (id: string[]) => Promise<void>
    clear: () => Promise<void>
    search: (query: any) => Promise<any[]>

}
