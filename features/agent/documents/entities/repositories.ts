import { IngestDocumentApiResponse } from "./type"

export type IAgentDocumentWriteRepository = {
    ingestDocuments: (file: File) => Promise<IngestDocumentApiResponse>
}
