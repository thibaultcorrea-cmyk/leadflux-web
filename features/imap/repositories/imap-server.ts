import { ENV } from "@/core/env";
import { FetchMessageObject, ImapFlow, SearchObject } from "imapflow";
import { FetchMailboxWithRangeDto, FindReplyByThreadIdDto, SearchInboxDto } from "../dto/schema";
import { imapValidator } from "../dto/validate";
import { ImapMessageEnvelope } from "../entities/imapflow";

/**
 * References n'existe pas dans l'ENVELOPE IMAP (RFC 3501) : c'est un header
 * brut, recupere uniquement si demande via `headers: ["references"]`. Depli
 * les lignes de continuation (repliees avec une espace/tab en debut de
 * ligne) sur une seule ligne avant de renvoyer la valeur.
 */
function parseReferencesHeader(headers?: Buffer): string | null {
    if (!headers) {
        return null;
    }
    const match = /^references:\s*([\s\S]*?)(?:\r?\n(?![ \t])|$)/im.exec(headers.toString("utf-8"));
    if (!match) {
        return null;
    }
    const value = match[1].replace(/\r?\n[ \t]+/g, " ").trim();
    return value.length > 0 ? value : null;
}

function toMessageEnvelope(message: FetchMessageObject): ImapMessageEnvelope {
    return {
        uid: message.uid,
        subject: message.envelope?.subject ?? null,
        from: message.envelope?.from?.[0]?.address ?? null,
        date: message.envelope?.date ?? null,
        messageId: message.envelope?.messageId ?? null,
        inReplyTo: message.envelope?.inReplyTo ?? null,
        references: parseReferencesHeader(message.headers),
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

    /**
     * Reprise incrementale d'une boite pour la detection de reponses en
     * masse (CLAUDE.md, cf. features/emails/services.ts hasReply) : une
     * seule connexion, un seul fetch borne par checkpoint.sinceUid (uid du
     * dernier message deja traite) plutot que checkpoint.since (SEARCH
     * SINCE ne filtre qu'au jour pres, cf. RFC 3501 — inutilisable pour
     * reprendre a chaque run d'un cron frequent sans rescanner toute la
     * journee). since ne sert que de repli pour le tout premier run, avant
     * qu'un uid n'ait ete enregistre. batchSize borne le nombre de messages
     * ramenes par appel ; c'est a l'appelant d'avancer le checkpoint (max
     * des uid recus) et de rappeler tant qu'un batch plein revient.
     *
     * uidValidity est renvoye a chaque appel : un uid n'a de sens que
     * relatif a cette valeur, et un serveur peut la faire changer (boite
     * reconstruite/migree). A l'appelant de comparer avec la valeur
     * precedemment stockee et de repartir de zero (sinceUid non fourni) si
     * elle a change, sous peine de filtrer sur des uid qui ne veulent plus
     * rien dire.
     */
    async fetchMailboxWithRange(data: FetchMailboxWithRangeDto): Promise<{ messages: ImapMessageEnvelope[]; uidValidity: number }> {
        if (!this.client.usable) {
            throw new Error("Server is not ready to fetch our messages");
        }

        const validateData = imapValidator.fetchMailboxWithRange(data);

        if (!validateData.success) {
            throw new Error(validateData.error.message);
        }

        const { mailbox, checkpoint, batchSize } = validateData.data;

        const query: SearchObject = checkpoint.sinceUid
            ? { uid: `${checkpoint.sinceUid + 1}:*` }
            : checkpoint.since
                ? { since: checkpoint.since }
                : { all: true };

        const messages: ImapMessageEnvelope[] = [];
        const lock = await this.client.getMailboxLock(mailbox);
        let uidValidity = 0;
        try {
            uidValidity = this.client.mailbox ? Number(this.client.mailbox.uidValidity) : 0;

            for await (const message of this.client.fetch(query, { envelope: true, headers: ["references"] })) {
                messages.push(toMessageEnvelope(message));
                if (messages.length >= batchSize) {
                    break;
                }
            }
        } finally {
            lock.release();
        }

        return { messages, uidValidity };
    }



    async close() {
        if (!this.client.usable) {
            return;
        }
        await this.client.logout();
    }
}
