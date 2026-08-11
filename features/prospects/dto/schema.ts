
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
