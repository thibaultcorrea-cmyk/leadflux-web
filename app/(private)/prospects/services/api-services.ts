import { LeadFinderFormSchemaType } from "../types/forms"
import prospectsResponse from "@/app/api/v1/leads/mocks/prospects-response"
import { API_BASE_URL, GRAPHQL_BASE_URL } from "@/core/params"
import { CREATE_SEARCH_PROSPECTS_MUTATION, GET_SEARCH_PROSPECTS_QUERY, SEND_PROSPECT_EMAIL_MUTATION } from "../_hooks/queries"
import request from "graphql-request"
import { Prospect } from "../types/prospect"


export const fetchLeadFinder = async (inputs: LeadFinderFormSchemaType) => {
    const url = new URL("/api/v1/leads/search", API_BASE_URL)
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
    })
    const data = await res.json()
    return data

}

export const fetchProspects = async () => {
    return request(GRAPHQL_BASE_URL, GET_SEARCH_PROSPECTS_QUERY);
}

export const createSearchProspects = async (inputs: LeadFinderFormSchemaType) => {
    return request(GRAPHQL_BASE_URL, CREATE_SEARCH_PROSPECTS_MUTATION, { inputs });
}


export const sendProspectEmail = async (prospect: Prospect) => {
    const inputs = {
        "prospectId": prospect.id,
        "prospectingConsent": true
    }
    return request(GRAPHQL_BASE_URL, SEND_PROSPECT_EMAIL_MUTATION, { inputs });
}   