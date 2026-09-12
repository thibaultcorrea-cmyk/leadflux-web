import { GRAPHQL_BASE_URL } from "@/core/params"
import request from "graphql-request"
import { GET_LAST_KNOWLEDGE_BASE } from "./queries"
import { LastKnowledgeBaseApiReturn } from "../../../../types/api-return"



export const fetchCurrentKnowledgeBaseApi = () => {
    return request<{ lastKnowledgeVersion: LastKnowledgeBaseApiReturn }>(GRAPHQL_BASE_URL, GET_LAST_KNOWLEDGE_BASE)
}