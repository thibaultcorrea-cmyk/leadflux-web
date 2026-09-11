import * as z from "zod"
import { KNOWLEDGE_BASE_STATUSES } from "@/db/schemas"



export const KnowledgeBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    fileId: z.string(),
    indexedBy: z.string().nullable(),
    status: z.enum(KNOWLEDGE_BASE_STATUSES),
    errorMessage: z.string().nullable(),
    totalIndexed: z.number().nullable(),
    countWords: z.number().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type KnowledgeBase = z.infer<typeof KnowledgeBaseSchema>



export const createKnowledgeBaseSchema = z.object({
    name: z.string().min(1, "name est requis"),
    fileId: z.string().min(1, "fileId est requis"),
    description: z.string().optional(),
})

export type CreateKnowledgeBaseDto = z.infer<typeof createKnowledgeBaseSchema>
