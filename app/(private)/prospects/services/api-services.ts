import { ENV } from "@/core/env"
import { LeadFinderFormSchemaType } from "../types/forms"


export const fetchLeadFinder = async (inputs: LeadFinderFormSchemaType) => {
    const url = new URL("/api/v1/leads/search", ENV.NEXT_PUBLIC_APP_URL)
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