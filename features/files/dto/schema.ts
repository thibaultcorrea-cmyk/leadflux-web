import * as z from "zod"



export const FileSchema = z.object({
    id: z.string(),
    originalName: z.string(),
    size: z.number(),
    type: z.string(),
    extension: z.string(),
    path: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type File = z.infer<typeof FileSchema>



export const createFileSchema = z.object({
    id: z.string().uuid().optional(),
    originalName: z.string().min(1, "originalName est requis"),
    size: z.number().positive("size doit etre positif"),
    type: z.string().min(1, "type est requis"),
    extension: z.string().min(1, "extension est requise"),
    path: z.string().min(1, "path est requis"),
})

export type CreateFileDto = z.infer<typeof createFileSchema>
