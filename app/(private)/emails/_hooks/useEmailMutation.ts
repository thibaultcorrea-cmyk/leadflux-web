"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateEmailMutationParams } from "../types/email-mutations"




export const useEmailMutation = () => {

    const queryClient = useQueryClient()

    const update = async () => useMutation({
        mutationFn: async (data: UpdateEmailMutationParams) => {
            console.log('data', data)

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emails'] })

        },
    })

    const remove = async () => { }

    const regenerate = async () => {

    }


    return { update, remove, regenerate }



}