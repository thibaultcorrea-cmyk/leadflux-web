import { CreateCompanyDto } from "./dto/schema"
import { companyValidator } from "./dto/validator"
import { CompanyWriteRepositoriesImpl } from "./repositories/write"
import { CompanyServices } from "./entities/services"



export const CompanyServicesImpl: CompanyServices = {
    create: async (input: CreateCompanyDto) => {
        const validated = companyValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        const { data } = validated
        const { city, ...companyData } = data
        const nameKey = nameKeyFactory(data.name)
        const cityKey = city ? cityKeyFactory(city) : undefined

        return CompanyWriteRepositoriesImpl.create({
            ...companyData,
            nameKey,
            cityKey,
        })
    },

    collections: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    update: async (company) => {
        throw new Error("Method not implemented.")
    },
    delete: async (id: string) => {
        throw new Error("Method not implemented.")
    },
    deleteMany: async (ids: string[]) => {
        throw new Error("Method not implemented.")
    },
    clear: async () => {
        await CompanyWriteRepositoriesImpl.truncate()
    },
}

const nameKeyFactory = (name: string) => name.trim().toLowerCase()
const cityKeyFactory = (city: string) => city.trim().toLowerCase()
