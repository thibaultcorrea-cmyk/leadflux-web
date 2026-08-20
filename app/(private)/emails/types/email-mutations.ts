import { GraphQLResponse } from "graphql-request"
import { Email, EmailStatus } from "./email"
import { EmailVersionSqlInfer } from "@/db/schemas"

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
export type RegenerateEmailApiResponse = GraphQLResponse<{
    regenerateEmailContent: Omit<EmailVersionSqlInfer, "updatedAt" | "createdAt">
}>