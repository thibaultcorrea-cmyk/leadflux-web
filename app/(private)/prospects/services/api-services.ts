import { LeadFinderFormSchemaType } from "../types/forms"
import prospectsResponse from "@/app/api/v1/leads/mocks/prospects-response"
import { API_BASE_URL } from "@/core/params"


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
    return {
        searches: prospectsResponse

    }
}