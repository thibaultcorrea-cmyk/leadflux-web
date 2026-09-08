import { findReplyByThreadIdSchema, searchInboxSchema } from "./schema";

export const imapValidator = {
    search: (inputs: unknown) => searchInboxSchema.safeParse(inputs),
    findReplyByThreadId: (inputs: unknown) => findReplyByThreadIdSchema.safeParse(inputs),
}
