import { createFileSchema } from "./schema"


export const fileValidator = {
    validate: (data: unknown) => createFileSchema.safeParse(data),
}
