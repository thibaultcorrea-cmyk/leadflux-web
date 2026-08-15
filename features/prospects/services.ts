import { ProspectServices } from "./entities/services";
import leadFinder from "./mocks/leads-finder-1785665650250.json"
import { prospectValidator } from "./dto/validator"
import { CreateProspectDto } from "./dto/schema"
import { ProspectWriteRepositoriesImpl } from "./repositories/write"



export const ProspectServicesImpl: ProspectServices = {
    create: async (prospect: CreateProspectDto) => {
        const validated = prospectValidator.validate(prospect)
        if (!validated.success) {
            throw validated.error
        }

        return ProspectWriteRepositoriesImpl.create(validated.data)
    },
    collections: (query) => Promise.resolve(leadFinder),
    update: (prospect) => Promise.resolve([]),
    delete: async (id) => {
        await ProspectWriteRepositoriesImpl.delete(id)
    },
    deleteMultiple: async (ids) => {
        await ProspectWriteRepositoriesImpl.deleteMultiple(ids)
    },
    clear: async () => {
        await ProspectWriteRepositoriesImpl.truncate()
    },
    search: (query) => Promise.resolve(leadFinder),

}
