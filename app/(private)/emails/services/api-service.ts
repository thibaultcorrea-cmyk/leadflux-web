import request from "graphql-request"
import { GET_EMAIL_PROSPECTS_QUERY } from "../_hooks/queries";
import { GRAPHQL_BASE_URL } from "@/core/params";
import { RegenerateEmailMutationParams, RemoveEmailMutationParams, UpdateEmailMutationParams } from "../types/email-mutations";

export const fetchEmailProspectsApi = async (): Promise<any> => {
    const data = await request(GRAPHQL_BASE_URL, GET_EMAIL_PROSPECTS_QUERY)
    return data
}



export const updateEmailApi = async (data: UpdateEmailMutationParams) => {
    const { emailId, versionId, ...rest } = data
    //return request(GRAPHQL_BASE_URL, UPDATE_EMAIL_MUTATION, data)
    return null;
}
export const removeEmailApi = async (data: RemoveEmailMutationParams) => {
    //return request(GRAPHQL_BASE_URL, REMOVE_EMAIL_MUTATION, data)
    return null;
}


export const regenerateEmailApi = async (data: RegenerateEmailMutationParams) => {
    //return request(GRAPHQL_BASE_URL, REGENERATE_EMAIL_MUTATION, data)
    return null;
}