import { ENV } from "@/core/env";
import { IAgentDocumentWriteRepository } from "../entities/repositories";



export const AgentDocumentWriteRepository: IAgentDocumentWriteRepository = {
    ingestDocuments: async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        const response = await fetch(`${ENV.N8N_WEBHOOK_URL}/ingest-document`, {
            method: "POST",
            body: formData,
        })
        return response.json()
    }

}