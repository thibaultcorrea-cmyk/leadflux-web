"use client"

import { useQuery } from "@tanstack/react-query"
import request, { gql } from "graphql-request"
import { GRAPHQL_BASE_URL } from "@/core/params"

export const LOGO_QUERY_KEY = {
    GET_CURRENT_COMPANY_LOGO: "GET_CURRENT_COMPANY_LOGO"
}

interface CurrentLogo {
    id: string
    key: string
}


export const fetchCurrentCompanyLogo = async () => {

    const query = gql`
        query CurrentLogo {
            currentLogo {
                id
                key
            }
        }
    `
    const queryResult = await request<{ currentLogo: CurrentLogo }>(GRAPHQL_BASE_URL, query)
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/logo`)
    return queryResult.currentLogo

}


export const useCurrentCompanyLogo = () => {

    return useQuery({
        queryKey: [LOGO_QUERY_KEY.GET_CURRENT_COMPANY_LOGO],
        queryFn: fetchCurrentCompanyLogo
    })
}