"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendProspectEmail } from "../services/api-services";
import { Prospect } from "../types/prospect";
import { QueryKey } from "./queries";



export function useProspectMutation() {

    const queryClient = useQueryClient();

    const sendProspectEmailMutation = useMutation({
        mutationFn: (prospects: Prospect[]) => sendProspectEmail(prospects),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SEARCH_PROSPECTS_RESULTS] });
        },
    });

    return {
        sendProspectEmail: sendProspectEmailMutation.mutateAsync,

    };

}