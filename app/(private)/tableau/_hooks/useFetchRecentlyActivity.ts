"use client"

import { useQuery } from "@tanstack/react-query"
import { retrieveRecentlyActivity } from "../services/api-services"
import { QueryKey } from "./queries"

const useFetchRecentlyActivity = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: [QueryKey.GET_RECENTLY_ACTIVITY],
        queryFn: retrieveRecentlyActivity,
    })
    return {
        isloading: isLoading,
        isError,
        recentlyActivity: data?.recentlyActivity ?? [],
    }
}

export default useFetchRecentlyActivity;
