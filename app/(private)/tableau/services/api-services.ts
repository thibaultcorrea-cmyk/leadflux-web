import { GRAPHQL_BASE_URL } from "@/core/params";
import request from "graphql-request";
import { GET_KPIS_QUERY } from "../_hooks/queries";
import { GraphqlApiReturn } from "@/types/apis.-services";
import { Kpi, KpiApiReturn } from "../types/tableau";

export const retrieveKpis = async (): Promise<GraphqlApiReturn<"kpis", KpiApiReturn[]>> => {
    return request(GRAPHQL_BASE_URL, GET_KPIS_QUERY);
}