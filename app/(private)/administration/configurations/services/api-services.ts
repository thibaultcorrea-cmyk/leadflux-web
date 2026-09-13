import request from "graphql-request";
import { GET_CURRENT_LOGO_QUERY } from "./queries";
import { GRAPHQL_BASE_URL } from "@/core/params";


export const fetchCurrentLogoApi = async () => {
    return request(GRAPHQL_BASE_URL, GET_CURRENT_LOGO_QUERY)
}
