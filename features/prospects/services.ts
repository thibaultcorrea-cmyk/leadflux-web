import { ProspectServices } from "./entities/services";
import leadFinder from "./mocks/leads-finder-1785665650250.json"



export const ProspectServicesImpl: ProspectServices = {
    create: (prospect) => Promise.resolve([]),
    collections: (query) => Promise.resolve(leadFinder),
    update: (prospect) => Promise.resolve([]),
    delete: (id) => Promise.resolve(),
    deleteMultiple: (ids) => Promise.resolve(),
    truncate: () => Promise.resolve(),
    search: (query) => Promise.resolve(leadFinder),

}