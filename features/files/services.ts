import { FileServices } from "./entities/services"
import { CreateFileDto } from "./dto/schema"
import { fileValidator } from "./dto/validator"
import { FileWriteRepositoriesImpl } from "./repositories/write"
import { FileReadRepositoriesImpl } from "./repositories/read"
import { UploadsServicesImpl } from "@/features/uploads/services"



export const FileServicesImpl: FileServices = {
    get: async (id: string) => {
        return FileReadRepositoriesImpl.get(id)
    },

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
        // Recupere l'extension avant suppression de la ligne : sans elle,
        // impossible de retrouver le fichier physique correspondant sur disque.
        const file = await FileReadRepositoriesImpl.get(id).catch(() => null)
        await FileWriteRepositoriesImpl.delete(id)
        if (file) {
            await UploadsServicesImpl.deleteFile({ id: file.id, extension: file.extension })
        }
    },
    deleteMany: async (ids: string[]) => {
        const foundFiles = await Promise.all(ids.map((id) => FileReadRepositoriesImpl.get(id).catch(() => null)))
        await FileWriteRepositoriesImpl.deleteMany(ids)
        await Promise.all(
            foundFiles
                .filter((file): file is NonNullable<typeof file> => file !== null)
                .map((file) => UploadsServicesImpl.deleteFile({ id: file.id, extension: file.extension })),
        )
    },
    clear: async () => {
        await FileWriteRepositoriesImpl.truncate()
    },
}
