import { InsertKnowledgeBaseSchema, createKnowledgeBaseSchema } from "./schema"


export const knowledgeBaseValidator = {
    insert: (data: unknown) => InsertKnowledgeBaseSchema.safeParse(data),
    create: (data: unknown) => createKnowledgeBaseSchema.safeParse(data),
}
