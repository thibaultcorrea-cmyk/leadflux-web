import { createProspectSchema } from "./schema"


export const prospectValidator = {
    validate: (data: unknown) => createProspectSchema.safeParse(data),
}
