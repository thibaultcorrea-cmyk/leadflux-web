/**
 * Preuve de faisabilite : verifier par IMAP qu'un prospect a repondu, sans
 * toucher a une vraie boite Gmail. S'appuie sur le service `greenmail` de
 * docker-compose.yml (faux serveur SMTP + IMAP) : `docker compose up -d greenmail`
 * avant de lancer ce test, sinon il echoue a la connexion.
 *
 * Ne prejuge pas de l'endroit ou vivra la detection reelle en prod (probablement
 * le workflow n8n, cf. CLAUDE.md §8 point 1) : ce test valide seulement le
 * mecanisme IMAP lui-meme.
 */
import { ImapFlow } from "imapflow";
import nodemailer from "nodemailer";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ENV } from "@/core/env";

const GREENMAIL_SMTP_PORT = 3025;

async function hasReplyInInbox(subjectContains: string): Promise<boolean> {
    const client = new ImapFlow({
        host: ENV.IMAP_TEST_HOST,
        port: ENV.IMAP_TEST_PORT,
        secure: false,
        auth: { user: ENV.IMAP_TEST_USER, pass: ENV.IMAP_TEST_PASS },
        logger: false,
    });

    await client.connect();
    try {
        const lock = await client.getMailboxLock("INBOX");
        try {
            for await (const message of client.fetch({ all: true }, { envelope: true })) {
                if (message.envelope.subject?.includes(subjectContains)) {
                    return true;
                }
            }
            return false;
        } finally {
            lock.release();
        }
    } finally {
        await client.logout();
    }
}

describe("Detection de reponse via IMAP (GreenMail local)", () => {
    const subjectMarker = `Re: proposition Leadflux ${Date.now()}`;

    beforeAll(async () => {
        const transporter = nodemailer.createTransport({
            host: ENV.IMAP_TEST_HOST,
            port: GREENMAIL_SMTP_PORT,
            secure: false,
            auth: { user: ENV.IMAP_TEST_USER, pass: ENV.IMAP_TEST_PASS },
        });

        try {
            await transporter.verify();
        } catch (error) {
            throw new Error(
                "GreenMail n'est pas joignable sur localhost:3025/3143 — lancer `docker compose up -d greenmail` avant ce test.",
                { cause: error },
            );
        } finally {
            transporter.close();
        }
    });

    it("ne detecte aucune reponse tant que le prospect n'a pas repondu", async () => {
        const replied = await hasReplyInInbox(subjectMarker);
        expect(replied).toBe(false);
    });

    it("detecte la reponse une fois le mail du prospect livre dans la boite", async () => {
        const transporter = nodemailer.createTransport({
            host: ENV.IMAP_TEST_HOST,
            port: GREENMAIL_SMTP_PORT,
            secure: false,
            auth: { user: ENV.IMAP_TEST_USER, pass: ENV.IMAP_TEST_PASS },
        });

        await transporter.sendMail({
            from: "prospect@exemple-client.fr",
            to: ENV.IMAP_TEST_USER,
            subject: subjectMarker,
            text: "Merci pour votre message, je suis interesse.",
        });
        transporter.close();

        const replied = await hasReplyInInbox(subjectMarker);
        expect(replied).toBe(true);
    });

    afterAll(async () => {
        const client = new ImapFlow({
            host: ENV.IMAP_TEST_HOST,
            port: ENV.IMAP_TEST_PORT,
            secure: false,
            auth: { user: ENV.IMAP_TEST_USER, pass: ENV.IMAP_TEST_PASS },
            logger: false,
        });
        await client.connect();
        const lock = await client.getMailboxLock("INBOX");
        try {
            await client.messageFlagsAdd({ all: true }, ["\\Deleted"]);
            await client.messageDelete({ all: true });
        } finally {
            lock.release();
        }
        await client.logout();
    });
});
