import { ProspectServices } from "./entities/services";
import leadFinder from "./mocks/leads-finder-1785665650250.json"
import { prospectValidator } from "./dto/validator"
import { CreateProspectDto } from "./dto/schema"
import { ProspectWriteRepositoriesImpl } from "./repositories/write"
import { SearchReadRepositoriesImpl } from "../search/repositories/read";
import { ProspectReadRepositoriesImpl } from "./repositories/read";



export const ProspectServicesImpl: ProspectServices = {
    create: async (prospect: CreateProspectDto) => {
        const validated = prospectValidator.validate(prospect)
        if (!validated.success) {
            throw validated.error
        }

        return ProspectWriteRepositoriesImpl.create(validated.data)
    },
    collections: (query) => SearchReadRepositoriesImpl.find(query),
    update: (prospect) => Promise.resolve([]),
    delete: async (id) => {
        await ProspectWriteRepositoriesImpl.delete(id)
    },
    deleteMany: async (ids) => {
        const succeded = []
        const failed = []
        try {
            for (const id of ids) {
                try {
                    await ProspectWriteRepositoriesImpl.delete(id)
                    succeded.push(id)
                } catch (error) {
                    failed.push(id)
                }
            }
            return { success: succeded.length, failed: failed.length, message: "prospects deleted successfully" }
        } catch (error) {
            console.log(error);
            throw new Error("An error occured while deleting prospects")
        }

    },
    clear: async () => {
        await ProspectWriteRepositoriesImpl.truncate()
    },
    search: (query) => Promise.resolve(leadFinder),
    find: async (id: string) => {
        const prospect = await ProspectReadRepositoriesImpl.getWithRelations(id)
        if (!prospect) {
            throw new Error("Prospect not found")
        }
        return prospect
    },

}
