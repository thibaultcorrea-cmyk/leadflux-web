import { FetchMailboxWithRangeDto, FindReplyByThreadIdDto, SearchInboxDto } from "../dto/schema";
import { ImapMessageEnvelope } from "./imapflow";

export interface IMAPService {
    search: (input: SearchInboxDto) => Promise<ImapMessageEnvelope[]>;
    hasReply: (input: FindReplyByThreadIdDto) => Promise<ImapMessageEnvelope[]>;
    fetchMailboxWithRange: (input: FetchMailboxWithRangeDto) => Promise<{ messages: ImapMessageEnvelope[]; uidValidity: number }>;

}