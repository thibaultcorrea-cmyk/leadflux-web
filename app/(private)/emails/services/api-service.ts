import request from "graphql-request"
import { GET_EMAIL_PROSPECTS_QUERY } from "../_hooks/queries";
import { GRAPHQL_BASE_URL } from "@/core/params";

export const fetchEmailProspectsApi = async (): Promise<any> => {
    const data = await request(GRAPHQL_BASE_URL, GET_EMAIL_PROSPECTS_QUERY)
    return data
}

