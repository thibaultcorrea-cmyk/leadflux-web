"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchCurrentLogoApi } from "../services/api-services"
import { SETTINGS_QUERIES_KEYS } from "../services/queries"


const useFetchSettings = () => {

    const currentLogoQuery = useQuery({
        queryKey: [SETTINGS_QUERIES_KEYS.GET_CURRENT_LOGO],
        queryFn: fetchCurrentLogoApi
    })





    return {
        currentLogoQuery
    }

}


export default useFetchSettings