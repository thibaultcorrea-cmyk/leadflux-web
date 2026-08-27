import * as z from "zod"



export const EmailVersionSchema = z.object({
    id: z.string(),
    emailId: z.string(),
    subject: z.string(),
    body: z.array(z.string()),
    knowledgeVersion: z.string().nullable(),
    generatedAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type EmailVersion = z.infer<typeof EmailVersionSchema>



export const createEmailVersionSchema = z.object({
    emailId: z.string().min(1, "emailId est requis"),
    subject: z.string().min(1, "L'objet est requis"),
    body: z.string().min(1, "Le corps de l'email est requis"),
    knowledgeVersion: z.string().optional(),
})

export type CreateEmailVersionDto = z.infer<typeof createEmailVersionSchema>
