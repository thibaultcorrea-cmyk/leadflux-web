import * as z from "zod"



export const CompanySchema = z.object({
    id: z.string(),
    name: z.string(),
    nameKey: z.string(),
    cityKey: z.string().nullable(),
    website: z.string().nullable(),
    description: z.string().nullable(),
    industryRaw: z.string().nullable(),
    industryId: z.string().nullable(),
    sizeRaw: z.string().nullable(),
    headcountMin: z.number().nullable(),
    headcountMax: z.number().nullable(),
    addressId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Company = z.infer<typeof CompanySchema>



export const createCompanySchema = z.object({
    name: z.string().min(1, "Le nom de l'entreprise est requis"),
    city: z.string().optional(),
    website: z.string().optional(),
    description: z.string().optional(),
    industryRaw: z.string().optional(),
    industryId: z.string().optional(),
    sizeRaw: z.string().optional(),
    headcountMin: z.number().optional(),
    headcountMax: z.number().optional(),
    addressId: z.string().optional(),
})

export type CreateCompanyDto = z.infer<typeof createCompanySchema>
