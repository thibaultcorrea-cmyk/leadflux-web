import { KnowledgeBaseServices } from "./entities/services"
import { CreateKnowledgeBaseDto } from "./dto/schema"
import { knowledgeBaseValidator } from "./dto/validator"
import { KnowledgeBaseWriteRepositoriesImpl } from "./repositories/write"
import { KnowledgeBaseReadRepositoriesImpl } from "./repositories/read"
import { UserServices } from "../users/services"



export const KnowledgeBaseServicesImpl: KnowledgeBaseServices = {
    create: async (input: CreateKnowledgeBaseDto) => {
        const validated = knowledgeBaseValidator.validate(input)
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
}
