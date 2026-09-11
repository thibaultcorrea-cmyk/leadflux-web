import { FileServices } from "./entities/services"
import { CreateFileDto } from "./dto/schema"
import { fileValidator } from "./dto/validator"
import { FileWriteRepositoriesImpl } from "./repositories/write"
import { FileReadRepositoriesImpl } from "./repositories/read"



export const FileServicesImpl: FileServices = {
    create: async (input: CreateFileDto) => {
        const validated = fileValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        return FileWriteRepositoriesImpl.create(validated.data)
    },

    collections: async (query: any) => {
        return FileReadRepositoriesImpl.find(query)
    },
    update: async (file) => {
        return FileWriteRepositoriesImpl.update(file)
    },
    delete: async (id: string) => {
        await FileWriteRepositoriesImpl.delete(id)
    },
    deleteMany: async (ids: string[]) => {
        await FileWriteRepositoriesImpl.deleteMany(ids)
    },
    clear: async () => {
        await FileWriteRepositoriesImpl.truncate()
    },
}
