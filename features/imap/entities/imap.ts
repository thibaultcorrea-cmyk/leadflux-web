import { FindReplyByThreadIdDto, SearchInboxDto } from "../dto/schema";
import { ImapMessageEnvelope } from "./imapflow";

export interface IMAPService {
    search: (input: SearchInboxDto) => Promise<ImapMessageEnvelope[]>;
    hasReply: (input: FindReplyByThreadIdDto) => Promise<boolean>;
}