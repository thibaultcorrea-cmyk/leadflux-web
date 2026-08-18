import { EmailVersionSqlInfer } from "@/db/schemas"
import { CreateEmailVersionDto } from "../dto/schema"


export type EmailVersionServices = {
    create: (emailVersion: CreateEmailVersionDto) => Promise<EmailVersionSqlInfer>
    collections: (query: any) => Promise<EmailVersionSqlInfer[]>
    update: (emailVersion: Partial<EmailVersionSqlInfer>) => Promise<EmailVersionSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
