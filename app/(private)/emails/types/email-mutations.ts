import { Email, EmailStatus, EmailVersion } from "./email"

export type UpdateEmailMutationParams = {
    emailId: string
    versionId: string
    status?: EmailStatus
    subject?: string
    body?: string
    recipient?: string


}


export type RemoveEmailMutationParams = { ids: string[] }
export type RemoveEmailApiResponse = Email

export type RegenerateEmailMutationParams = { ids: string[] }
export type RegenerateEmailApiResponse = {
    regenerateEmailContent: EmailVersion
}