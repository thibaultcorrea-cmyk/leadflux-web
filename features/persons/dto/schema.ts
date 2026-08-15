import * as z from "zod"



export const PersonSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    emailKey: z.string(),
    jobTitle: z.string().nullable(),
    phone: z.string().nullable(),
    linkedinUrl: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Person = z.infer<typeof PersonSchema>



export const createPersonSchema = z.object({
    fullName: z.string().min(1, "Le nom complet est requis"),
    email: z.email("L'email est invalide"),
    jobTitle: z.string().optional(),
    phone: z.string().optional(),
    linkedinUrl: z.string().optional(),
})

export type CreatePersonDto = z.infer<typeof createPersonSchema>
