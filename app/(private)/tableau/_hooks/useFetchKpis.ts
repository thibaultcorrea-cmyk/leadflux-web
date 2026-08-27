"use client"

import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "./queries";
import { retrieveKpis } from "../services/api-services";
import { parser } from "../components/schema/parser";
import { useMemo } from "react";


const useFetchKpis = () => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: [QueryKey.GET_KPIS],
        queryFn: retrieveKpis,
    });
    const kpis = useMemo(() => {
        if (!data) return []
        const dataFilter = data.kpis.filter((kpi) => kpi.id !== "repliedRate")
        return parser.mapIcon(dataFilter)

    }, [data])
    return {
        kpis,
        isError,
        isLoading,
        refetch,
    };
}

export default useFetchKpis;