import z from "zod";

export const searchInboxSchema = z.object({
    mailbox: z.string().min(1).default("INBOX"),
    subjectContains: z.string().min(1, "subjectContains est requis"),
})

export type SearchInboxDto = z.infer<typeof searchInboxSchema>

export const findReplyByThreadIdSchema = z.object({
    mailbox: z.string().min(1).default("INBOX"),
    threadId: z.string().min(1, "threadId est requis"),
})

export type FindReplyByThreadIdDto = z.infer<typeof findReplyByThreadIdSchema>
