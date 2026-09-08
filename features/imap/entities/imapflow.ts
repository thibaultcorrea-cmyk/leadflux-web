export type ImapMessageEnvelope = {
    uid: number,
    subject: string | null,
    from: string | null,
    date: Date | null,
    messageId: string | null,
    inReplyTo: string | null,
}
