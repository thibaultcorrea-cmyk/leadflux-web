
export type IAgentDocumentWriteRepository = {
    ingestDocuments: (file: File) => Promise<any>
}
