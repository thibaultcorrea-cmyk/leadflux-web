import * as z from "zod"
import { S3_MIN_PART_SIZE_BYTES } from "../entities/type"



export const uploadFileSchema = z.object({
    key: z.string().min(1, "key est requis"),
    contentType: z.string().min(1, "contentType est requis"),
})

export type UploadFileDto = z.infer<typeof uploadFileSchema>



export const uploadMultipartFileSchema = uploadFileSchema.extend({
    // Optionnel : @aws-sdk/lib-storage retombe sur 5 Mo par defaut si absent.
    partSize: z.number().int().min(S3_MIN_PART_SIZE_BYTES, `partSize doit etre >= ${S3_MIN_PART_SIZE_BYTES} octets (5 Mo, minimum impose par S3)`).optional(),
})

export type UploadMultipartFileDto = z.infer<typeof uploadMultipartFileSchema>



export const presignFileSchema = z.object({
    key: z.string().min(1, "key est requis"),
    expiresInSeconds: z.number().positive().optional(),
})

export type PresignFileDto = z.infer<typeof presignFileSchema>
