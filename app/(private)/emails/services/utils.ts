import { Email, EmailVersion } from "../types/email"

export const getLastVersion = (versions: EmailVersion[]): EmailVersion => {
    const length = versions.length
    return versions[length - 1]
}

export const getDraftedEmails = (emails: Email[]): Email[] => {
    return emails.filter((email) => email.status === "draft")
}


export const getIdsOfDraftedEmails = (emails: Email[]): string[] => {
    return getDraftedEmails(emails).map((email) => email.id)

}