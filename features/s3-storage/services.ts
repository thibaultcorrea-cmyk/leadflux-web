import { S3StorageServices } from "./entities/services"
import { s3StorageValidator } from "./dto/validator"
import { S3StorageWriteRepositoriesImpl } from "./repositories/write"
import { S3StorageReadRepositoriesImpl } from "./repositories/read"



export const S3StorageServicesImpl: S3StorageServices = {
    upload: async (input) => {
        const validated = s3StorageValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        return S3StorageWriteRepositoriesImpl.upload({ ...validated.data, body: input.body })
    },

    presign: async (input) => {
        const validated = s3StorageValidator.validatePresign(input)
        if (!validated.success) {
            throw validated.error
        }

        return S3StorageReadRepositoriesImpl.presign(validated.data)
    },

    get: async (key: string) => {
        return S3StorageReadRepositoriesImpl.get(key)
    },

    delete: async (key: string) => {
        await S3StorageWriteRepositoriesImpl.delete(key)
    },

    clear: async () => {
        await S3StorageWriteRepositoriesImpl.truncate()
    },
}
