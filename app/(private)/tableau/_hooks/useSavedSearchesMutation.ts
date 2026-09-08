"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearSavedSearches } from "../services/api-services";
import { QueryKey } from "./queries";

export function useSavedSearchesMutation() {
    const queryClient = useQueryClient();

    const clearSavedSearchesMutation = useMutation({
        mutationFn: () => clearSavedSearches(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_SAVED_SEARCH] });
        },
    });

    return {
        clear: clearSavedSearchesMutation.mutateAsync,
    };
}
