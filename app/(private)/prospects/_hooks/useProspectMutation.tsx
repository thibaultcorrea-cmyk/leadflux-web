"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSearchProspects, deleteProspects, sendProspectEmail, truncateProspects } from "../services/api-services";
import { Prospect } from "../types/prospect";
import { QueryKey } from "./queries";
import { LeadFinderFormSchemaType } from "../types/forms";



export function useProspectMutation() {

    const queryClient = useQueryClient();

    const createSearchProspectsMutation = useMutation({
        mutationFn: (params: LeadFinderFormSchemaType) => createSearchProspects(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS] })

        }
    })
    const sendProspectEmailMutation = useMutation({
        mutationFn: (prospects: Prospect[]) => sendProspectEmail(prospects),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS] });
        },
    });

    const deleteProspectMutation = useMutation({
        mutationFn: (prospectIds: string[]) => deleteProspects(prospectIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS] });
        },
    });

    const truncateProspectsMutation = useMutation({
        mutationFn: () => truncateProspects(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS] });
        },
    });

    return {
        createSearchProspect: createSearchProspectsMutation.mutateAsync,
        sendProspectEmail: sendProspectEmailMutation.mutateAsync,
        deleteProspects: deleteProspectMutation.mutateAsync,
        truncate: truncateProspectsMutation.mutateAsync,
    };

}