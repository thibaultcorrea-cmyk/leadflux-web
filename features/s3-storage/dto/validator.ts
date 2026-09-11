import { presignFileSchema, uploadFileSchema } from "./schema"


export const s3StorageValidator = {
    validate: (data: unknown) => uploadFileSchema.safeParse(data),
    validatePresign: (data: unknown) => presignFileSchema.safeParse(data),
}
