"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LeadFinderFormSchemaType } from "../types/forms"
import { createSearchProspects } from "../services/api-services"
import { QueryKey } from "./queries"



export const useMutationSearchProspects = () => {

    const queryClient = useQueryClient()

    const createSearchProspectsMutation = useMutation({
        mutationFn: (params: LeadFinderFormSchemaType) => createSearchProspects(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS] })

        }
    })

    return {
        createSearchProspect: createSearchProspectsMutation.mutateAsync
    }

}