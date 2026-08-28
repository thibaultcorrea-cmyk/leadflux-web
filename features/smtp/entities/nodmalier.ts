
export type NodmailerTransportResponse = {
    accepted: string[],
    rejected: string[],
    ehlo: string[],
    envelopeTime: number,
    messageTime: number,
    messageSize: number,
    response: string,
    envelope: {
        from: string,
        to: string[]
    },
    messageId: string

}