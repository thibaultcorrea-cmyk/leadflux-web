import { KnowledgeBaseServices } from "./entities/services"
import { CreateKnowledgeBaseDto } from "./dto/schema"
import { knowledgeBaseValidator } from "./dto/validator"
import { KnowledgeBaseWriteRepositoriesImpl } from "./repositories/write"
import { KnowledgeBaseReadRepositoriesImpl } from "./repositories/read"
import { UserServices } from "../users/services"
import { mapLastKnowledgeBase } from "./factory/knowledge-base-factory"
import { LastKnowledgeBase } from "./entities/generic"



export const KnowledgeBaseServicesImpl: KnowledgeBaseServices = {
    create: async (input: CreateKnowledgeBaseDto) => {
        const validated = knowledgeBaseValidator.create(input)
        if (!validated.success) {
            throw validated.error
        }

        // Utilisateur ayant declenche cette version (cf. db/schemas/knowledgeBase.ts, indexedBy).
        const currentUser = await UserServices.getCurrentUser()

        return KnowledgeBaseWriteRepositoriesImpl.create({
            ...validated.data,
            indexedBy: currentUser.id,
        })
    },

    collections: async (query: any) => {
        return KnowledgeBaseReadRepositoriesImpl.find(query)
    },
    update: async (knowledgeBase) => {
        return KnowledgeBaseWriteRepositoriesImpl.update(knowledgeBase)
    },
    delete: async (id: string) => {
        await KnowledgeBaseWriteRepositoriesImpl.delete(id)
    },
    deleteMany: async (ids: string[]) => {
        await KnowledgeBaseWriteRepositoriesImpl.deleteMany(ids)
    },
    clear: async () => {
        await KnowledgeBaseWriteRepositoriesImpl.truncate()
    },
    getLastKnowledgeVersion: async () => {
        const currentUser = await UserServices.getCurrentUser()
        const knowledgeBase = await KnowledgeBaseReadRepositoriesImpl.findByUserId(currentUser.id) as LastKnowledgeBase
        if (!knowledgeBase) {
            throw new Error("Knowledge base not found")
        }
        return mapLastKnowledgeBase(knowledgeBase)
    },
}
