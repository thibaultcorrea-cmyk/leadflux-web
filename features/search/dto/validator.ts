import { criterialSchema, createSearchProspectsSchema } from "./schema";


export const searchProspectsValidator = {
    validate: (data: unknown) => createSearchProspectsSchema.safeParse(data),
    validateCriterial: (data: unknown) => criterialSchema.safeParse(data),


}