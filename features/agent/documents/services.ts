import { FileServicesImpl } from "@/features/files/services";
import { IngestDocumentInputDto } from "./dto/schema";
import { agentDocumentValidator } from "./dto/validator";
import { IAgentDocumentService } from "./entities/services";
import { IndexedChunk } from "./entities/type";
import { AgentDocumentWriteRepository } from "./repositories/write";
import { UploadsServicesImpl } from "@/features/uploads/services";
import { buffer } from "stream/consumers";
import { KNOWLEDGE_BASE_STATUSES } from "@/db/schemas";

export const AgentDocumentServiceImpl: IAgentDocumentService = {
    ingestDocuments: async (inputs) => {
        try {
            const inputvalidate = agentDocumentValidator.ingestData(inputs)
            if (!inputvalidate.success) throw inputvalidate.error
            const { fileId } = inputvalidate.data
            const fileEntity = await FileServicesImpl.get(fileId)
            const knowledgeBaseFile = await generateFileFromFileId(fileEntity.id)
            const response = await AgentDocumentWriteRepository.ingestDocuments(knowledgeBaseFile)
            const originalText = mergeChunksFactory(response)

            return {
                wordsCount: originalText.split(/\s+/).filter(Boolean).length,
                totalIndexed: response.length,
                status: KNOWLEDGE_BASE_STATUSES[1]
            }
        } catch (error) {
            return {
                wordsCount: 0,
                totalIndexed: 0,
                status: KNOWLEDGE_BASE_STATUSES[2]
            }
        }
    }
}


const generateFileFromFileId = async (fileId: string): Promise<File> => {
    const { file, stream } = await UploadsServicesImpl.read(fileId)
    const bytes = await buffer(stream)
    return new File([bytes], file.originalName, { type: file.type })
}

// Les chunks se chevauchent (chunk overlap du splitter n8n) : on reconstitue le texte source
// en dedupliquant par numero de ligne avant de compter les mots, sinon les lignes partagees
// entre deux chunks consecutifs seraient comptees deux fois.
const mergeChunksFactory = (chunks: IndexedChunk[]) => {
    const lineByNumber = new Map<number, string>()
    for (const chunk of chunks) {
        chunk.pageContent.split("\n").forEach((line, i) => {
            lineByNumber.set(chunk.metadata.loc.lines.from + i, line)
        })
    }

    return [...lineByNumber.entries()]
        .sort(([a], [b]) => a - b)
        .map(([, line]) => line)
        .join("\n")
}
