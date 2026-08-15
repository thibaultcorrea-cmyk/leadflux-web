import { CompanySqlInfer } from "@/db/schemas"
import { CreateCompanyDto } from "../dto/schema"


export type CompanyServices = {
    create: (company: CreateCompanyDto) => Promise<CompanySqlInfer>
    collections: (query: any) => Promise<CompanySqlInfer[]>
    update: (company: Partial<CompanySqlInfer>) => Promise<CompanySqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
