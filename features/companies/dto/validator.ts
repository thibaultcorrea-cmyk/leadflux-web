import { createCompanySchema } from "./schema"


export const companyValidator = {
    validate: (data: unknown) => createCompanySchema.safeParse(data),
}
