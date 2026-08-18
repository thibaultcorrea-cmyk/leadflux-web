import request from "graphql-request"
import { GET_EMAIL_PROSPECTS_QUERY, UPDATE_EMAIL_CONTENT_MUTATION } from "../_hooks/queries";
import { GRAPHQL_BASE_URL } from "@/core/params";
import { RegenerateEmailMutationParams, RemoveEmailMutationParams, UpdateEmailMutationParams } from "../types/email-mutations";
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


export const regenerateEmailApi = async (data: RegenerateEmailMutationParams) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 1500))
    await wait

    const newVersion = {
        id: crypto.randomUUID(),
        body: "TEST",
        subject: "TEST",
        knowledgeVersion: "new version",
        generatedAt: new Date().toISOString(),

    } satisfies EmailVersion
    //return request(GRAPHQL_BASE_URL, REGENERATE_EMAIL_MUTATION, data)
    return newVersion;
}