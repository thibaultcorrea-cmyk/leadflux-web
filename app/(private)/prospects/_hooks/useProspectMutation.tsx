"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSearchProspects, deleteProspects, sendProspectEmail, truncateProspects } from "../services/api-services";
import { Prospect } from "../types/prospect";
import { QueryKey } from "./queries";
import { QueryKey as TableauQueryKey } from "@/app/(private)/tableau/_hooks/queries";
import { LeadFinderFormSchemaType } from "../types/forms";



export function useProspectMutation() {

    const queryClient = useQueryClient();

    // Le Tableau (KPIs, entonnoir, recherches enregistrées, activité récente) lit
    // les memes donnees via des query keys distinctes de celles de cette page :
    // sans invalidation explicite ici, il reste fige sur ses anciennes valeurs
    // tant qu'il n'est pas demonte/remonte (changement de page), meme si le
    // staleTime par defaut de React Query est 0.
    const invalidateTableauQueries = () => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS] })
        // queryClient.invalidateQueries({ queryKey: [TableauQueryKey.GET_KPIS] });
        // queryClient.invalidateQueries({ queryKey: [TableauQueryKey.GET_FUNNEL_STEP] });
        //queryClient.invalidateQueries({ queryKey: [TableauQueryKey.GET_SAVED_SEARCH] });
        // queryClient.invalidateQueries({ queryKey: [TableauQueryKey.GET_RECENTLY_ACTIVITY] });
    };

    const createSearchProspectsMutation = useMutation({
        mutationFn: (params: LeadFinderFormSchemaType) => createSearchProspects(params),
        onSuccess: () => {
            invalidateTableauQueries();

        }
    })
    const sendProspectEmailMutation = useMutation({
        mutationFn: (prospects: Prospect[]) => sendProspectEmail(prospects),
        onSuccess: () => {
            invalidateTableauQueries();
        },
    });

    const deleteProspectMutation = useMutation({
        mutationFn: (prospectIds: string[]) => deleteProspects(prospectIds),
        onSuccess: () => {
            invalidateTableauQueries();
        },
    });

    const truncateProspectsMutation = useMutation({
        mutationFn: () => truncateProspects(),
        onSuccess: () => {
            invalidateTableauQueries();
        },
    });


    return {

        createSearchProspect: createSearchProspectsMutation.mutateAsync,
        sendProspectEmail: sendProspectEmailMutation.mutateAsync,
        deleteProspects: deleteProspectMutation.mutateAsync,
        truncate: truncateProspectsMutation.mutateAsync,
    };

}