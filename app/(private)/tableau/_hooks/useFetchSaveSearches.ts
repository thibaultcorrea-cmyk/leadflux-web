"use client"
import { useQuery } from "@tanstack/react-query";
import { QueryKey, GET_SAVED_SEARCH_QUERY } from "./queries";
import { retrieveSavedSearch } from "../services/api-services";

const useFetchSaveSearches = () => {
    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: [QueryKey.GET_SAVED_SEARCH],
        queryFn: retrieveSavedSearch,
    });
    return {
        savedSearches: data?.lastSearchResults ?? [],
        isError,
        isLoading,
        refetch,
    }
}

export default useFetchSaveSearches;