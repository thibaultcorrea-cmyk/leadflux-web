"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RemoveEmailMutationParams, UpdateEmailMutationParams } from "../types/email-mutations"
import { regenerateEmailApi, removeEmailApi, validateSendEmailApi, updateEmailApi, validateSendEmailsManyApi, truncateEmailApi } from "../services/api-service"
import { QueryKey } from "./queries"




export const useEmailMutation = () => {

    const queryClient = useQueryClient()

    const updateMutation = useMutation({
        mutationFn: async (data: UpdateEmailMutationParams) => updateEmailApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })

        },
    })

    const removeMutation = useMutation({
        mutationFn: async ({ ids }: RemoveEmailMutationParams) => removeEmailApi(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })

        },
    })

    const regenerateMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => regenerateEmailApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })
        },
    })

    const validateSendEmailMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => validateSendEmailApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })
        },
    })

    const validateSendEmailsManyMutation = useMutation({
        mutationFn: async ({ ids }: { ids: string[] }) => validateSendEmailsManyApi(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })
        },
    })

    const truncateEmailMutation = useMutation({
        mutationFn: truncateEmailApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })
        },
    })



    return { update: updateMutation.mutateAsync, remove: removeMutation.mutateAsync, regenerate: regenerateMutation.mutateAsync, validateAndSend: validateSendEmailMutation.mutateAsync, validateSendEmailsMany: validateSendEmailsManyMutation.mutateAsync, truncate: truncateEmailMutation.mutateAsync }



}