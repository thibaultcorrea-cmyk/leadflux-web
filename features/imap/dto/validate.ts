import { searchInboxSchema } from "./schema";

export const imapValidator = {
    search: (inputs: unknown) => searchInboxSchema.safeParse(inputs)
}
