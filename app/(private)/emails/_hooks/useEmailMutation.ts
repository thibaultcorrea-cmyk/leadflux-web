"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RemoveEmailMutationParams, UpdateEmailMutationParams } from "../types/email-mutations"
import { regenerateEmailApi, removeEmailApi, validateSendEmailApi, updateEmailApi, validateSendEmailsManyApi, truncateEmailApi } from "../services/api-service"
import { QueryKey } from "./queries"
import { QueryKey as TableauQueryKey } from "@/app/(private)/tableau/_hooks/queries"




export const useEmailMutation = () => {

    const queryClient = useQueryClient()

    // Le Tableau (KPIs drafted/sent/replied, entonnoir, activite recente) lit
    // les memes emails via des query keys distinctes de celles de cette page :
    // sans invalidation explicite ici, il reste fige sur ses anciennes valeurs
    // tant qu'il n'est pas demonte/remonte (changement de page).
    const invalidateTableauQueries = () => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })
        //queryClient.invalidateQueries({ queryKey: [TableauQueryKey.GET_KPIS] });
        //queryClient.invalidateQueries({ queryKey: [TableauQueryKey.GET_FUNNEL_STEP] });
        //queryClient.invalidateQueries({ queryKey: [TableauQueryKey.GET_RECENTLY_ACTIVITY] });
    };

    const updateMutation = useMutation({
        mutationFn: async (data: UpdateEmailMutationParams) => updateEmailApi(data),
        onSuccess: () => {
            invalidateTableauQueries();

        },
    })

    const removeMutation = useMutation({
        mutationFn: async ({ ids }: RemoveEmailMutationParams) => removeEmailApi(ids),
        onSuccess: () => {
            invalidateTableauQueries();

        },
    })

    const regenerateMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => regenerateEmailApi(id),
        onSuccess: () => {
            invalidateTableauQueries();
        },
    })

    const validateSendEmailMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => validateSendEmailApi(id),
        onSuccess: () => {
            invalidateTableauQueries();
        },
    })

    const validateSendEmailsManyMutation = useMutation({
        mutationFn: async ({ ids }: { ids: string[] }) => validateSendEmailsManyApi(ids),
        onSuccess: () => {
            invalidateTableauQueries();
        },
    })

    const truncateEmailMutation = useMutation({
        mutationFn: truncateEmailApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })
            invalidateTableauQueries();
        },
    })



    return { update: updateMutation.mutateAsync, remove: removeMutation.mutateAsync, regenerate: regenerateMutation.mutateAsync, validateAndSend: validateSendEmailMutation.mutateAsync, validateSendEmailsMany: validateSendEmailsManyMutation.mutateAsync, truncate: truncateEmailMutation.mutateAsync }



}