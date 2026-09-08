import { SearchInboxDto, searchInboxSchema } from "./dto/schema";
import { ImapFlowRepository } from "./repositories/imap-server";

export const IMAPServiceImpl = {
    search: async (input: SearchInboxDto) => {
        try {
            const validateData = searchInboxSchema.safeParse(input);
            if (!validateData.success) {
                throw new Error(validateData.error.message);
            }
            const imapFlowRepository = new ImapFlowRepository();
            const ready = await imapFlowRepository.ready();
            if (!ready) {
                throw new Error("Server is not ready to fetch our messages");
            }
            const messages = await imapFlowRepository.search(validateData.data);
            await imapFlowRepository.close();
            return messages;
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
}
