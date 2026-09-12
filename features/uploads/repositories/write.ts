import { mkdir, open, readdir, readFile, rename, rm, writeFile } from "node:fs/promises"
import { IUploadsWriteRepository } from "../entities/repository"
import { getUploadsStorageRoot, uploadsChunkPath, uploadsChunksDir, uploadsFinalDir, uploadsFinalPath, uploadsMetaPath, uploadsTmpDir } from "../storage"



export const UploadsWriteRepositoriesImpl: IUploadsWriteRepository = {
    createSession: async (meta) => {
        await mkdir(uploadsChunksDir(meta.uploadId), { recursive: true })
        await writeFile(uploadsMetaPath(meta.uploadId), JSON.stringify(meta, null, 2), "utf-8")
    },

    writeChunk: async ({ uploadId, chunkIndex, data }) => {
        // Un fichier par index, jamais un append sur un blob partage : un chunk
        // renvoye deux fois (retry reseau du navigateur) ecrase le precedent
        // au lieu de s'y ajouter, l'assemblage reste idempotent.
        await writeFile(uploadsChunkPath(uploadId, chunkIndex), data)
    },

    assemble: async ({ uploadId, id, extension, totalChunks, expectedSizeBytes }) => {
        for (let index = 0; index < totalChunks; index += 1) {
            try {
                await readFile(uploadsChunkPath(uploadId, index))
            } catch {
                throw new Error(`Fragment manquant (${index}/${totalChunks - 1}) pour l'upload ${uploadId}`)
            }
        }

        await mkdir(uploadsFinalDir(id), { recursive: true })
        const partPath = `${uploadsFinalPath(id, extension)}.part`
        const handle = await open(partPath, "w")
        let size = 0
        try {
            for (let index = 0; index < totalChunks; index += 1) {
                const chunk = await readFile(uploadsChunkPath(uploadId, index))
                await handle.write(chunk)
                size += chunk.byteLength
            }
        } finally {
            await handle.close()
        }

        if (size !== expectedSizeBytes) {
            await rm(partPath, { force: true })
            throw new Error(`Taille assemblee (${size} octets) differente de la taille annoncee (${expectedSizeBytes} octets)`)
        }

        await rename(partPath, uploadsFinalPath(id, extension))
        return { size }
    },

    cleanupSession: async (uploadId) => {
        await rm(uploadsTmpDir(uploadId), { recursive: true, force: true })
    },

    writeFile: async ({ id, extension, data }) => {
        await mkdir(uploadsFinalDir(id), { recursive: true })
        await writeFile(uploadsFinalPath(id, extension), data)
        return { size: data.byteLength }
    },

    deleteFile: async ({ id, extension }) => {
        await rm(uploadsFinalPath(id, extension), { force: true })
        // Ne supprime le dossier <id>/ que s'il est devenu vide : evite de
        // supprimer un dossier qui contiendrait encore d'autres fichiers.
        const remaining = await readdir(uploadsFinalDir(id)).catch(() => [])
        if (remaining.length === 0) {
            await rm(uploadsFinalDir(id), { recursive: true, force: true })
        }
    },

    moveFile: async ({ fromId, fromExtension, toId, toExtension }) => {
        await mkdir(uploadsFinalDir(toId), { recursive: true })
        await rename(uploadsFinalPath(fromId, fromExtension), uploadsFinalPath(toId, toExtension))
        const remaining = await readdir(uploadsFinalDir(fromId)).catch(() => [])
        if (remaining.length === 0) {
            await rm(uploadsFinalDir(fromId), { recursive: true, force: true })
        }
    },

    renameFile: async ({ id, fromExtension, toExtension }) => {
        await rename(uploadsFinalPath(id, fromExtension), uploadsFinalPath(id, toExtension))
    },

    clearStorage: async () => {
        await rm(getUploadsStorageRoot(), { recursive: true, force: true })
        await mkdir(getUploadsStorageRoot(), { recursive: true })
    },
}
