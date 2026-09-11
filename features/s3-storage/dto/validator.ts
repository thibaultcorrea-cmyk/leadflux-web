import { presignFileSchema, uploadFileSchema, uploadMultipartFileSchema } from "./schema"


export const s3StorageValidator = {
    validate: (data: unknown) => uploadFileSchema.safeParse(data),
    validateMultipart: (data: unknown) => uploadMultipartFileSchema.safeParse(data),
    validatePresign: (data: unknown) => presignFileSchema.safeParse(data),
}
