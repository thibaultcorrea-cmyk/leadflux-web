
import * as z from "zod"




export const ProspectSchema = z.object({
    id: z.string(),
    company: z.string(),
    contactName: z.string(),
    contactRole: z.string(),
    sector: z.string(),
    city: z.string(),
    headcountMin: z.number(),
    headcountMax: z.number(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    linkedin: z.string(),
    website: z.string(),
    notes: z.string(),
    tags: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Prospect = z.infer<typeof ProspectSchema>



export const createSearchProspectsSchema = z.object({
    jobTitle: z.string().min(1, "Le titre du poste est requis"),
    industry: z.string().min(1, "Le secteur est requis"),
    location: z.string().min(1, "La ville est requise"),
    employeeRange: z.string().min(1, "La fourchette d'effectif est requise"),
    headcountMax: z.number().optional(),
    headcountMin: z.number().optional(),
    revenue: z.string().min(1, "Le chiffre d'affaires est requis"),
})


export type CreateSearchProspectsDto = z.infer<typeof createSearchProspectsSchema>


export const criterialSchema = z.object({
    jobTitle: z.string().min(1, "Le titre du poste est requis"),
    industry: z.string().min(1, "Le secteur est requis"),
    location: z.string().min(1, "La ville est requise"),
    employeeRange: z.string().min(1, "La fourchette d'effectif est requise"),
    headcountMax: z.number().optional(),
    headcountMin: z.number().optional(),
    revenue: z.string().min(1, "Le chiffre d'affaires est requis"),
})

export type CriterialDto = z.infer<typeof criterialSchema>

