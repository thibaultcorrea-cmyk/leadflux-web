"use client"

import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "./queries";
import { retrieveKpis } from "../services/api-services";
import { parser } from "../components/schema/parser";


const useGetKpis = () => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: [QueryKey.GET_KPIS],
        queryFn: retrieveKpis,
    });
    const kpis = parser.mapIcon(data?.kpis ?? []) ?? [];
    return {
        kpis,
        isError,
        isLoading,
        refetch,
    };
}

export default useGetKpis;