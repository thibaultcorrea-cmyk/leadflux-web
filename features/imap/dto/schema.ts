import z from "zod";

export const searchInboxSchema = z.object({
    mailbox: z.string().min(1).default("INBOX"),
    subjectContains: z.string().min(1, "subjectContains est requis"),
})

export type SearchInboxDto = z.infer<typeof searchInboxSchema>
