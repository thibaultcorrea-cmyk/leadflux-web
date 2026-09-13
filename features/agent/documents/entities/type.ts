export type IndexedChunk = {
    metadata: {
        source: string
        blobType: string
        loc: {
            lines: {
                from: number
                to: number
            }
        }
    }
    pageContent: string
}

export type IngestDocumentApiResponse = IndexedChunk[]
