"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RemoveEmailMutationParams, UpdateEmailMutationParams } from "../types/email-mutations"
import { regenerateEmailApi, removeEmailApi, validateSendEmailApi, updateEmailApi } from "../services/api-service"
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




    return { update: updateMutation.mutateAsync, remove: removeMutation.mutateAsync, regenerate: regenerateMutation.mutateAsync, validateAndSend: validateSendEmailMutation.mutateAsync }



}