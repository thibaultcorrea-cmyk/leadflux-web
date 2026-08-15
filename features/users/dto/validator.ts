import { idParamSchema } from "./schema";


export const UserValidator = {
    idParamValidator: (id: string) => idParamSchema.safeParse(id),
}