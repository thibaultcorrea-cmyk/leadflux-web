import { KnowledgeBaseSqlInfer } from "@/db/schemas"
import { CreateKnowledgeBaseDto } from "../dto/schema"

export type KnowledgeBaseServices = {
    create: (knowledgeBase: CreateKnowledgeBaseDto) => Promise<KnowledgeBaseSqlInfer>
    collections: (query: any) => Promise<KnowledgeBaseSqlInfer[]>
    getLastKnowledgeVersion: () => Promise<any>
    update: (knowledgeBase: Partial<KnowledgeBaseSqlInfer>) => Promise<KnowledgeBaseSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
