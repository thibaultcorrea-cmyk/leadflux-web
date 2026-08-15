import { createEmailVersionSchema } from "./schema"


export const emailVersionValidator = {
    validate: (data: unknown) => createEmailVersionSchema.safeParse(data),
}
