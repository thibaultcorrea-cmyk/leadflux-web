import { IngestDocumentInputSchema } from "./schema";

export const agentDocumentValidator = {
    ingestData: (data: unknown) => IngestDocumentInputSchema.safeParse(data),
}

