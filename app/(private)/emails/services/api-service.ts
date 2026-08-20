import request from "graphql-request"
import { GET_EMAIL_PROSPECTS_QUERY, REGENERATE_EMAIL_MUTATION, SEND_EMAIL_MUTATION, UPDATE_EMAIL_CONTENT_MUTATION } from "../_hooks/queries";
import { GRAPHQL_BASE_URL } from "@/core/params";
import { RegenerateEmailApiResponse, RegenerateEmailMutationParams, RemoveEmailMutationParams, UpdateEmailMutationParams } from "../types/email-mutations";
import { EmailVersion } from "../types/email";

export const fetchEmailProspectsApi = async (): Promise<any> => {
    const data = await request(GRAPHQL_BASE_URL, GET_EMAIL_PROSPECTS_QUERY)
    return data
}



export const updateEmailApi = async (input: UpdateEmailMutationParams) => {

    return request(GRAPHQL_BASE_URL, UPDATE_EMAIL_CONTENT_MUTATION, { input })
}
export const removeEmailApi = async (data: RemoveEmailMutationParams) => {
    //return request(GRAPHQL_BASE_URL, REMOVE_EMAIL_MUTATION, data)
    return null;
}


export const regenerateEmailApi = async (id: string) => {
    return request<RegenerateEmailApiResponse>(GRAPHQL_BASE_URL, REGENERATE_EMAIL_MUTATION, { id })
}

export const validateSendEmailApi = async (id: string) => {
    return request(GRAPHQL_BASE_URL, SEND_EMAIL_MUTATION, { id })
}