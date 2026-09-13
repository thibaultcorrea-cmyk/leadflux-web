import { IngestDocumentDto, IngestDocumentInputDto } from "../dto/schema"





export type IAgentDocumentService = {
    ingestDocuments: (input: IngestDocumentInputDto) => Promise<any>
}
