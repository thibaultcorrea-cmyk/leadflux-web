import { createAddressSchema } from "./schema"


export const addressValidator = {
    validate: (data: unknown) => createAddressSchema.safeParse(data),
}
