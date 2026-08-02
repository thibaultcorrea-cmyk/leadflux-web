"use client"
import { fetchProspects } from "../services/api-services"
import { useQuery } from "@tanstack/react-query"
import { QueryKey } from "./queries"
import { useMemo } from "react"
import { parseSearchResults } from "../schema/parser"

export const useFetchSearchProspectResults = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS],
        queryFn: () => fetchProspects(),
    })

    const prospects = useMemo(() => {
        if (!data) return []
        return parseSearchResults(data.searches)

    }, [data])

    return {
        prospects,
        isLoading,
        error
    }


}