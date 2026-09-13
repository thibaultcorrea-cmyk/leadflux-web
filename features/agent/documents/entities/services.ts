import { IngestDocumentDto, IngestDocumentInputDto } from "../dto/schema"





export type IngestDocumentResult = {
    wordsCount: number
    indexedCount: number
}

export type IAgentDocumentService = {
    ingestDocuments: (input: IngestDocumentInputDto) => Promise<IngestDocumentResult>
}
