import { KnowledgeBaseStatusValue } from "@/db/schemas"
import { IngestDocumentDto, IngestDocumentInputDto } from "../dto/schema"





export type IngestDocumentResult = {
    wordsCount: number
    totalIndexed: number
    status: KnowledgeBaseStatusValue
}

export type IAgentDocumentService = {
    ingestDocuments: (input: IngestDocumentInputDto) => Promise<IngestDocumentResult>
}
