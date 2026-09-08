import { fetchMailboxWithRangeSchema, findReplyByThreadIdSchema, searchInboxSchema } from "./schema";

export const imapValidator = {
    search: (inputs: unknown) => searchInboxSchema.safeParse(inputs),
    findReplyByThreadId: (inputs: unknown) => findReplyByThreadIdSchema.safeParse(inputs),
    fetchMailboxWithRange: (inputs: unknown) => fetchMailboxWithRangeSchema.safeParse(inputs),
}
