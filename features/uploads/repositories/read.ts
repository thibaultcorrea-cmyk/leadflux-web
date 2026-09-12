import { createReadStream } from "node:fs"
import { readdir, readFile, stat } from "node:fs/promises"
import { IUploadsReadRepository } from "../entities/repository"
import { UploadSessionMeta } from "../entities/type"
import { uploadsChunksDir, uploadsFinalPath, uploadsMetaPath } from "../storage"



export const UploadsReadRepositoriesImpl: IUploadsReadRepository = {
    readSessionMeta: async (uploadId) => {
        try {
            const raw = await readFile(uploadsMetaPath(uploadId), "utf-8")
            return JSON.parse(raw) as UploadSessionMeta
        } catch {
            throw new Error(`Session d'upload introuvable ou deja finalisee/annulee: ${uploadId}`)
        }
    },

    listReceivedChunks: async (uploadId) => {
        try {
            const entries = await readdir(uploadsChunksDir(uploadId))
            return entries.map(Number).sort((a, b) => a - b)
        } catch {
            return []
        }
    },

    readFile: async ({ id, extension }) => {
        const finalPath = uploadsFinalPath(id, extension)
        await stat(finalPath)
        return createReadStream(finalPath)
    },

    fileExists: async ({ id, extension }) => {
        try {
            await stat(uploadsFinalPath(id, extension))
            return true
        } catch {
            return false
        }
    },
}
