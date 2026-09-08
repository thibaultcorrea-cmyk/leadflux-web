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

/**
 * uid seul dans le checkpoint : le critere IMAP SINCE ne porte que sur le
 * jour (pas d'heure), donc inutilisable pour reprendre a chaque run d'un cron
 * frequent sans rescanner toute la journee. sinceUid (dernier uid traite)
 * est la reprise precise ; since ne sert que de repli pour le tout premier
 * run, quand aucun uid n'a encore ete enregistre.
 */
export const fetchMailboxWithRangeSchema = z.object({
    mailbox: z.string().min(1).default("INBOX"),
    checkpoint: z.object({
        sinceUid: z.number().int().positive().optional(),
        since: z.date().optional(),
    }).default({}),
    batchSize: z.number().int().positive().max(1000).default(200),
})

export type FetchMailboxWithRangeDto = z.infer<typeof fetchMailboxWithRangeSchema>
