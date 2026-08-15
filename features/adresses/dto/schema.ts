import * as z from "zod"



export const AddressSchema = z.object({
    id: z.string(),
    street: z.string().nullable(),
    city: z.string().nullable(),
    cityKey: z.string().nullable(),
    zip: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Address = z.infer<typeof AddressSchema>



export const createAddressSchema = z.object({
    city: z.string().min(1, "La ville est requise"),
    country: z.string().min(1, "Le pays est requis"),
    street: z.string().optional(),
    zip: z.string().optional(),
    state: z.string().optional(),
})

export type CreateAddressDto = z.infer<typeof createAddressSchema>
