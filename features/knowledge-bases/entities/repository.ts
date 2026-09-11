import { KnowledgeBaseSqlInfer, KnowledgeBaseSqlInsert } from "@/db/schemas"



export interface IKnowledgeBaseReadRepository {
    get: (id: string) => Promise<KnowledgeBaseSqlInfer>
    find: (query: any) => Promise<KnowledgeBaseSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface IKnowledgeBaseWriteRepository {
    create: (knowledgeBase: KnowledgeBaseSqlInsert) => Promise<KnowledgeBaseSqlInfer>
    update: (knowledgeBase: Partial<KnowledgeBaseSqlInfer>) => Promise<KnowledgeBaseSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
