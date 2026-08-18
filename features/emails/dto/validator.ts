import { createEmailSchema, updateEmailContentSchema, updateEmailStatusSchema } from "./schema"


export const emailValidator = {
    validate: (data: unknown) => createEmailSchema.safeParse(data),
    validateStatus: (data: unknown) => updateEmailStatusSchema.safeParse(data),
    validateUpdateEmailContent: (data: unknown) => updateEmailContentSchema.partial().safeParse(data),
}
