import { GRAPHQL_BASE_URL } from "@/core/params";
import request from "graphql-request";
import { GET_KPIS_QUERY, GET_SAVED_SEARCH_QUERY } from "../_hooks/queries";
import { GraphqlApiReturn } from "@/types/apis.-services";
import { KpiApiReturn, SavedSearchReturn } from "../types/tableau";
import { SavedSearchItem } from "@/features/stats/entities/type";

export const retrieveKpis = async (): Promise<GraphqlApiReturn<"kpis", KpiApiReturn[]>> => {
    return request(GRAPHQL_BASE_URL, GET_KPIS_QUERY);
}

export const retrieveSavedSearch = async (): Promise<GraphqlApiReturn<"lastSearchResults", SavedSearchReturn[]>> => {
    return request(GRAPHQL_BASE_URL, GET_SAVED_SEARCH_QUERY);
}