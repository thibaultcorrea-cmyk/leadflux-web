import { ENV } from "@/core/env";
import { FetchMessageObject, ImapFlow, SearchObject } from "imapflow";
import { FindReplyByThreadIdDto, SearchInboxDto } from "../dto/schema";
import { imapValidator } from "../dto/validate";
import { ImapMessageEnvelope } from "../entities/imapflow";

function toMessageEnvelope(message: FetchMessageObject): ImapMessageEnvelope {
    return {
        uid: message.uid,
        subject: message.envelope?.subject ?? null,
        from: message.envelope?.from?.[0]?.address ?? null,
        date: message.envelope?.date ?? null,
        messageId: message.envelope?.messageId ?? null,
        inReplyTo: message.envelope?.inReplyTo ?? null,
    };
}

export class ImapFlowRepository {
    client: ImapFlow;

    constructor() {
        this.client = new ImapFlow({
            host: ENV.IMAP_HOST,
            port: ENV.IMAP_PORT,
            secure: ENV.IMAP_SECURE,
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
                    found.push(toMessageEnvelope(message));
                }
            }
        } finally {
            lock.release();
        }

        return found;
    }

    /**
     * Un email envoye porte son Message-ID dans emails.thread_id (CLAUDE.md,
     * cf. features/emails/services.ts). Une reponse reprend cet id dans son
     * header In-Reply-To, et le plus souvent aussi dans References : chercher
     * les deux couvre les clients qui n'en renseignent qu'un des deux.
     */
    async findByThreadId(data: FindReplyByThreadIdDto): Promise<ImapMessageEnvelope[]> {
        if (!this.client.usable) {
            throw new Error("Server is not ready to fetch our messages");
        }

        const validateData = imapValidator.findReplyByThreadId(data);

        if (!validateData.success) {
            throw new Error(validateData.error.message);
        }

        const found: ImapMessageEnvelope[] = [];
        const lock = await this.client.getMailboxLock(validateData.data.mailbox);
        try {
            const query: SearchObject = {
                or: [
                    { header: { "in-reply-to": validateData.data.threadId } },
                    { header: { "references": validateData.data.threadId } },
                ],
            };
            for await (const message of this.client.fetch(query, { envelope: true })) {
                found.push(toMessageEnvelope(message));
            }
        } finally {
            lock.release();
        }

        return found;
    }

    async close() {
        if (!this.client.usable) {
            return;
        }
        await this.client.logout();
    }
}
