import { Email, EmailStatus } from "./email"

export type UpdateEmailMutationParams = {
    id: string
    data: {
        status?: EmailStatus
        subject?: string
        body?: string
    }
}


export type RemoveEmailMutationParams = { ids: string[] }
export type RemoveEmailApiResponse = Email

export type RegenerateEmailMutationParams = { ids: string[] }
export type RegenerateEmailApiResponse = Email