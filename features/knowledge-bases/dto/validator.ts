import { createKnowledgeBaseSchema } from "./schema"


export const knowledgeBaseValidator = {
    validate: (data: unknown) => createKnowledgeBaseSchema.safeParse(data),
}
