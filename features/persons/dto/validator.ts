import { createPersonSchema } from "./schema"


export const personValidator = {
    validate: (data: unknown) => createPersonSchema.safeParse(data),
}
