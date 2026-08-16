"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QueryKey } from "./queries"
import { fetchEmailProspectsApi } from "../services/api-service"



export function useFetchEmails() {

    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKey.GET_EMAIL_PROSPECTS],
        queryFn: () => fetchEmailProspectsApi()

    })
    return { data, isLoading, error }
}