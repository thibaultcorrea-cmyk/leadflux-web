import { ENV } from "@/core/env";
import { AgentEmailGenerateApiInput, AgentEmailGenerateApiOutput } from "../entities/agentEmail"



const N8N_WEBHOOK_URL = ENV.N8N_WEBHOOK_URL;


const API_ENDPOINT = {
    generateEmailContent: `${N8N_WEBHOOK_URL}/leadflux-redaction`,
}



export const AgentEmailWriteRepository = {
    generate: async (payload: AgentEmailGenerateApiInput): Promise<AgentEmailGenerateApiOutput> => {
        try {


            const res = await fetch(API_ENDPOINT.generateEmailContent, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(payload)
                console.log(data)
                throw new Error(data.message)
            }
            return data as AgentEmailGenerateApiOutput
        } catch (error) {
            console.log(error)
            throw new Error("Failed to generate email content")
        }

    },
}





