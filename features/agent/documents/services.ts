import { FileServicesImpl } from "@/features/files/services";
import { IngestDocumentInputDto } from "./dto/schema";
import { agentDocumentValidator } from "./dto/validator";
import { IAgentDocumentService } from "./entities/services";
import { AgentDocumentWriteRepository } from "./repositories/write";
import { UploadsServicesImpl } from "@/features/uploads/services";
import { buffer } from "stream/consumers";

export const AgentDocumentServiceImpl: IAgentDocumentService = {
    ingestDocuments: async (inputs) => {
        const inputvalidate = agentDocumentValidator.ingestData(inputs)
        if (!inputvalidate.success) throw inputvalidate.error
        const { fileId } = inputvalidate.data
        const fileEntity = await FileServicesImpl.get(fileId)
        const knowledgeBaseFile = await generateFileFromFileId(fileEntity.id)

        const response = await AgentDocumentWriteRepository.ingestDocuments(knowledgeBaseFile)






        return {
            wordsCount: 0,
            indexedCount: 0
        }
    }
}


const generateFileFromFileId = async (fileId: string): Promise<File> => {
    const { file, stream } = await UploadsServicesImpl.read(fileId)
    const bytes = await buffer(stream)
    return new File([bytes], file.originalName, { type: file.type })

}
