import { FindReplyByThreadIdDto, findReplyByThreadIdSchema, SearchInboxDto, searchInboxSchema } from "./dto/schema";
import { IMAPService } from "./entities/imap";
import { ImapFlowRepository } from "./repositories/imap-server";

async function withImapConnection<T>(run: (repository: ImapFlowRepository) => Promise<T>): Promise<T> {
    const imapFlowRepository = new ImapFlowRepository();
    try {
        const ready = await imapFlowRepository.ready();
        if (!ready) {
            throw new Error("Server is not ready to fetch our messages");
        }
        return await run(imapFlowRepository);
    } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
    } finally {
        await imapFlowRepository.close();
    }
}

export const IMAPServiceImpl: IMAPService = {
    search: async (input: SearchInboxDto) => {
        const validateData = searchInboxSchema.safeParse(input);
        if (!validateData.success) {
            throw new Error(validateData.error.message);
        }
        return withImapConnection((repository) => repository.search(validateData.data));
    },

    /**
     * threadId = Message-ID renvoye a l'envoi et stocke dans emails.thread_id
     * (cf. features/emails/services.ts, transition vers le statut "sent").
     * Ne met a jour aucun statut : lecture seule, l'appelant decide quoi
     * faire du resultat (CLAUDE.md §8, point 1 : le declencheur n'est pas
     * encore tranche).
     */
    hasReply: async (input: FindReplyByThreadIdDto) => {
        const validateData = findReplyByThreadIdSchema.safeParse(input);
        if (!validateData.success) {
            throw new Error(validateData.error.message);
        }
        const messages = await withImapConnection((repository) => repository.findByThreadId(validateData.data));
        return messages.length > 0;
    },
}
