"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RegenerateEmailMutationParams, RemoveEmailMutationParams, UpdateEmailMutationParams } from "../types/email-mutations"
import { regenerateEmailApi, removeEmailApi, updateEmailApi } from "../services/api-service"
import { QueryKey } from "./queries"




export const useEmailMutation = () => {

    const queryClient = useQueryClient()

    const update = async () => useMutation({
        mutationFn: async (data: UpdateEmailMutationParams) => updateEmailApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })

        },
    })

    const remove = async () => useMutation({
        mutationFn: async (data: RemoveEmailMutationParams) => removeEmailApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })

        },
    })

    const regenerate = async () => useMutation({
        mutationFn: async (data: RegenerateEmailMutationParams) => regenerateEmailApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_EMAIL_PROSPECTS] })

        },
    })


    return { update, remove, regenerate }



}