import { GRAPHQL_BASE_URL } from "@/core/params";
import request from "graphql-request";
import { GET_KPIS_QUERY, GET_RECENTLY_ACTIVITY_QUERY, GET_SAVED_SEARCH_QUERY } from "../_hooks/queries";
import { GraphqlApiReturn } from "@/types/apis.-services";
import { KpiApiReturn, RecentActivityRow, SavedSearchReturn } from "../types/tableau";

export const retrieveKpis = async (): Promise<GraphqlApiReturn<"kpis", KpiApiReturn[]>> => {
    return request(GRAPHQL_BASE_URL, GET_KPIS_QUERY);
}

export const retrieveSavedSearch = async (): Promise<GraphqlApiReturn<"lastSearchResults", SavedSearchReturn[]>> => {
    return request(GRAPHQL_BASE_URL, GET_SAVED_SEARCH_QUERY);
}

export const retrieveRecentlyActivity = async (): Promise<GraphqlApiReturn<"recentlyActivity", RecentActivityRow[]>> => {
    return request(GRAPHQL_BASE_URL, GET_RECENTLY_ACTIVITY_QUERY);
}

export const retrieveFunnelStep = async (): Promise<GraphqlApiReturn<"kpis", KpiApiReturn[]>> => {
    return request(GRAPHQL_BASE_URL, GET_KPIS_QUERY);
}




export const retrieveEmailSendChart = async (): Promise<[]> => {
    return []
}