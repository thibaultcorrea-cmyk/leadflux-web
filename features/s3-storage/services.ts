import { S3StorageServices } from "./entities/services"
import { S3UploadProgressListener } from "./entities/type"
import { s3StorageValidator } from "./dto/validator"
import { S3StorageWriteRepositoriesImpl } from "./repositories/write"
import { S3StorageReadRepositoriesImpl } from "./repositories/read"

/**
 * Listener par defaut de l'upload multipart : une part envoyee = une ligne de
 * log. Pas de branchement front pour l'instant (pas de barre de progression
 * cablee), donc on se contente de logger plutot que d'exposer l'event.
 */
const logUploadProgress: S3UploadProgressListener = (progress) => {
    const percent = progress.total
        ? Math.round(((progress.loaded ?? 0) / progress.total) * 100)
        : undefined

    console.log(
        `[s3-storage] part ${progress.part ?? "?"} envoyee — ${progress.loaded ?? 0}/${progress.total ?? "?"} octets${percent !== undefined ? ` (${percent}%)` : ""}`,
    )
}

export const S3StorageServicesImpl: S3StorageServices = {
    upload: async (input) => {
        const validated = s3StorageValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        return S3StorageWriteRepositoriesImpl.upload({ ...validated.data, body: input.body })
    },

    uploadMultipart: async (input) => {
        const validated = s3StorageValidator.validateMultipart(input)
        if (!validated.success) {
            throw validated.error
        }

        return S3StorageWriteRepositoriesImpl.uploadMultipart({ ...validated.data, body: input.body }, logUploadProgress)
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
