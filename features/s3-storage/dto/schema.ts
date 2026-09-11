import * as z from "zod"



export const uploadFileSchema = z.object({
    key: z.string().min(1, "key est requis"),
    contentType: z.string().min(1, "contentType est requis"),
})

export type UploadFileDto = z.infer<typeof uploadFileSchema>



export const presignFileSchema = z.object({
    key: z.string().min(1, "key est requis"),
    expiresInSeconds: z.number().positive().optional(),
})

export type PresignFileDto = z.infer<typeof presignFileSchema>
