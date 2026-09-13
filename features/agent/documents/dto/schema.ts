import z from "zod";

export const IngestDocumentSchema = z.object({
    file: z.instanceof(File)
})
export type IngestDocumentDto = z.infer<typeof IngestDocumentSchema>

export const IngestDocumentInputSchema = z.object({
    fileId: z.string()
})
export type IngestDocumentInputDto = z.infer<typeof IngestDocumentInputSchema>

