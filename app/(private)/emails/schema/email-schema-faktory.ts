
import type { Email, EmailVersion } from "../types/email";


export const emailToEmailFormFaktorySchema = ({ email, version }: { email: Email, version: EmailVersion }) => {

    return {
        subject: version.subject,
        body: version.body,
        recipient: email.recipient,
    }

}