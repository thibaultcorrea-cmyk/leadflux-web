import { CreatePersonDto } from "./dto/schema"
import { personValidator } from "./dto/validator"
import { PersonWriteRepositoriesImpl } from "./repositories/write"
import { PersonServices } from "./entities/services"



export const PersonServicesImpl: PersonServices = {
    create: async (input: CreatePersonDto) => {
        const validated = personValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        const { data } = validated
        const emailKey = emailKeyFactory(data.email)

        return PersonWriteRepositoriesImpl.create({
            ...data,
            emailKey,
        })
    },

    collections: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    update: async (person) => {
        throw new Error("Method not implemented.")
    },
    delete: async (id: string) => {
        throw new Error("Method not implemented.")
    },
    deleteMultiple: async (ids: string[]) => {
        throw new Error("Method not implemented.")
    },
    truncate: async () => {
        throw new Error("Method not implemented.")
    },
}

const emailKeyFactory = (email: string) => email.trim().toLowerCase()
