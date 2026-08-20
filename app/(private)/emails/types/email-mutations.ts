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



export type ApiManyIdsResponse = {
    message?: string
    success: number
    errors?: number
}

export type SendEmailApiResponse = ApiManyIdsResponse 