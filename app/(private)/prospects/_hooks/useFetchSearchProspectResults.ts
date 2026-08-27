"use client"
import { fetchProspects } from "../services/api-services"
import { useQuery } from "@tanstack/react-query"
import { QueryKey } from "./queries"
import { useMemo } from "react"
import { parseSearchResults } from "../schema/parser"
import { UNKNOWN_CRITERIA } from "../services/row-actions"

export const useFetchSearchProspectResults = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS],
        queryFn: () => fetchProspects(),
    })


    const prospects = useMemo(() => {
        if (!data) return []
        const results = data.searches[0]
        if (!results) return []
        return parseSearchResults(results.results)

    }, [data])

    const resultCount = useMemo(() => {
        if (!data) return 0
        return data.searches.resultCount
    }, [data])

    const criteria = useMemo(() => {
        if (!data) return UNKNOWN_CRITERIA
        const result = data.searches[0]
        if (!result) return UNKNOWN_CRITERIA
        return result.criteria

    }, [data])



    return {
        prospects,
        isLoading,
        error,
        resultCount,
        criteria
    }


}   