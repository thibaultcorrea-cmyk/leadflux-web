import { createInitialAdminSchema, idParamSchema } from "./schema";


export const UserValidator = {
    idParamValidator: (id: string) => idParamSchema.safeParse(id),
    createInitialAdminValidator: (data: unknown) => createInitialAdminSchema.safeParse(data),
}