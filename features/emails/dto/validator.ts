import { createEmailSchema, updateEmailStatusSchema } from "./schema"


export const emailValidator = {
    validate: (data: unknown) => createEmailSchema.safeParse(data),
    validateStatus: (data: unknown) => updateEmailStatusSchema.safeParse(data),
}
