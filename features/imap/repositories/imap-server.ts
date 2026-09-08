import { ENV } from "@/core/env";
import { ImapFlow } from "imapflow";
import { SearchInboxDto } from "../dto/schema";
import { imapValidator } from "../dto/validate";
import { ImapMessageEnvelope } from "../entities/imapflow";

export class ImapFlowRepository {
    client: ImapFlow;

    constructor() {
        this.client = new ImapFlow({
            host: ENV.IMAP_HOST,
            port: ENV.IMAP_PORT,
            secure: true,
            auth: {
                user: ENV.IMAP_USER,
                pass: ENV.IMAP_PASS,
            },
            logger: false,
        });
    }

    async ready(): Promise<boolean> {
        try {
            await this.client.connect();
            console.log("Server is ready to fetch our messages");
            return true;
        } catch (err) {
            console.error("Connection failed:", err);
            return false;
        }
    }

    async search(data: SearchInboxDto): Promise<ImapMessageEnvelope[]> {
        if (!this.client.usable) {
            throw new Error("Server is not ready to fetch our messages");
        }

        const validateData = imapValidator.search(data);

        if (!validateData.success) {
            throw new Error(validateData.error.message);
        }

        const found: ImapMessageEnvelope[] = [];
        const lock = await this.client.getMailboxLock(validateData.data.mailbox);
        try {
            for await (const message of this.client.fetch({ all: true }, { envelope: true })) {
                if (message.envelope?.subject?.includes(validateData.data.subjectContains)) {
                    found.push({
                        uid: message.uid,
                        subject: message.envelope.subject ?? null,
                        from: message.envelope.from?.[0]?.address ?? null,
                        date: message.envelope.date ?? null,
                        messageId: message.envelope.messageId ?? null,
                        inReplyTo: message.envelope.inReplyTo ?? null,
                    });
                }
            }
        } finally {
            lock.release();
        }

        return found;
    }

    async close() {
        await this.client.logout();
    }
}
