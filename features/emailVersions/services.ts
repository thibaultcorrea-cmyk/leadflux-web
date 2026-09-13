import { EmailVersionServices } from "./entities/services"
import { CreateEmailVersionDto } from "./dto/schema"
import { emailVersionValidator } from "./dto/validator"
import { EmailVersionWriteRepositoriesImpl } from "./repositories/write"
import { EmailVersionReadRepositoriesImpl } from "./repositories/read"



export const EmailVersionServicesImpl: EmailVersionServices = {
    create: async (input: CreateEmailVersionDto) => {
        const validated = emailVersionValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        return EmailVersionWriteRepositoriesImpl.create(validated.data)
    },

    collections: async (query: any) => {
        return EmailVersionReadRepositoriesImpl.find(query)
    },
    update: async (emailVersion) => {
        throw new Error("Method not implemented.")
    },
    delete: async (id: string) => {
        await EmailVersionWriteRepositoriesImpl.delete(id)
    },
    deleteMany: async (ids: string[]) => {
        await EmailVersionWriteRepositoriesImpl.deleteMany(ids)
    },
    clear: async () => {
        await EmailVersionWriteRepositoriesImpl.truncate()
    },
}
