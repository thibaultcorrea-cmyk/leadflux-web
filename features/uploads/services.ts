import { randomUUID } from "node:crypto"
import path from "node:path"
import { FileServicesImpl } from "@/features/files/services"
import { UserServices } from "@/features/users/services"
import { UploadContext } from "./dto/schema"
import { uploadsValidator } from "./dto/validator"
import { UploadsServices } from "./entities/services"
import { UploadsReadRepositoriesImpl } from "./repositories/read"
import { UploadsWriteRepositoriesImpl } from "./repositories/write"



const CONTEXT_RULES: Record<UploadContext, { allowedMimeTypes: string[] | null; maxSizeBytes: number }> = {
    // Aligne sur le hint UI existant, ReplaceLogoModal: "PNG, JPEG ou WebP · 2 Mo max".
    logo: { allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"], maxSizeBytes: 2 * 1024 * 1024 },
    // Aligne sur le hint UI existant, KnowledgeBaseSection: PDF/DOCX/Markdown/TXT.
    "knowledge-base": {
        allowedMimeTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/markdown",
            "text/plain",
        ],
        maxSizeBytes: 5 * 1024 * 1024,
    },
    // Plafond de securite generique (pas de hint UI existant a respecter ici).
    generic: { allowedMimeTypes: null, maxSizeBytes: 20 * 1024 * 1024 },
}

const assertWithinContextRules = (dto: { context: UploadContext; mimeType: string; sizeBytes: number }) => {
    const rules = CONTEXT_RULES[dto.context]
    if (rules.allowedMimeTypes && !rules.allowedMimeTypes.includes(dto.mimeType)) {
        throw new Error(`Type de fichier non autorise pour le contexte "${dto.context}": ${dto.mimeType}`)
    }
    if (dto.sizeBytes > rules.maxSizeBytes) {
        throw new Error(`Fichier trop volumineux pour le contexte "${dto.context}" (max ${rules.maxSizeBytes} octets)`)
    }
}

const extensionFromFileName = (fileName: string) => path.extname(fileName).replace(/^\./, "").toLowerCase() || "bin"

export const UploadsServicesImpl: UploadsServices = {
    createSession: async (input) => {
        const validated = uploadsValidator.validateCreate(input)
        if (!validated.success) {
            throw validated.error
        }

        assertWithinContextRules(validated.data)
        // Leve si pas de session (meme mecanisme que features/knowledge-bases/services.ts).
        await UserServices.getCurrentUser()

        const uploadId = randomUUID()
        await UploadsWriteRepositoriesImpl.createSession({
            ...validated.data,
            uploadId,
            extension: extensionFromFileName(validated.data.fileName),
            createdAt: new Date().toISOString(),
        })

        return { uploadId }
    },

    writeChunk: async (input) => {
        const validated = uploadsValidator.validateWriteChunk(input)
        if (!validated.success) {
            throw validated.error
        }

        const meta = await UploadsReadRepositoriesImpl.readSessionMeta(validated.data.uploadId)
        if (validated.data.chunkIndex >= meta.totalChunks) {
            throw new Error(`chunkIndex hors limites (0..${meta.totalChunks - 1})`)
        }

        await UploadsWriteRepositoriesImpl.writeChunk({ ...validated.data, data: input.data })
        const receivedChunks = await UploadsReadRepositoriesImpl.listReceivedChunks(validated.data.uploadId)

        return { chunkIndex: validated.data.chunkIndex, receivedChunks: receivedChunks.length, totalChunks: meta.totalChunks }
    },

    complete: async (input) => {
        const validated = uploadsValidator.validateComplete(input)
        if (!validated.success) {
            throw validated.error
        }

        const meta = await UploadsReadRepositoriesImpl.readSessionMeta(validated.data.uploadId)

        const { size } = await UploadsWriteRepositoriesImpl.assemble({
            uploadId: meta.uploadId,
            id: meta.uploadId, // meme uuid reutilise comme files.id (cf. plan)
            extension: meta.extension,
            totalChunks: meta.totalChunks,
            expectedSizeBytes: meta.sizeBytes,
        })

        const created = await FileServicesImpl.create({
            id: meta.uploadId,
            originalName: meta.fileName,
            size,
            type: meta.mimeType,
            extension: meta.extension,
            path: `${meta.uploadId}/${meta.uploadId}.${meta.extension}`,
        })

        await UploadsWriteRepositoriesImpl.cleanupSession(meta.uploadId)

        return created
    },

    abort: async (input) => {
        const validated = uploadsValidator.validateAbort(input)
        if (!validated.success) {
            throw validated.error
        }
        await UploadsWriteRepositoriesImpl.cleanupSession(validated.data.uploadId)
    },

    read: async (fileId) => {
        await UserServices.getCurrentUser()
        const file = await FileServicesImpl.get(fileId)
        const stream = await UploadsReadRepositoriesImpl.readFile({ id: file.id, extension: file.extension })
        return { file, stream }
    },

    writeFile: async (input) => {
        const validated = uploadsValidator.validateWriteFile(input)
        if (!validated.success) {
            throw validated.error
        }
        await UserServices.getCurrentUser()
        return UploadsWriteRepositoriesImpl.writeFile({ ...validated.data, data: input.data })
    },

    deleteFile: async (input) => {
        const validated = uploadsValidator.validateDeleteFile(input)
        if (!validated.success) {
            throw validated.error
        }
        await UserServices.getCurrentUser()
        await UploadsWriteRepositoriesImpl.deleteFile(validated.data)
    },

    moveFile: async (input) => {
        const validated = uploadsValidator.validateMoveFile(input)
        if (!validated.success) {
            throw validated.error
        }
        await UserServices.getCurrentUser()
        await UploadsWriteRepositoriesImpl.moveFile(validated.data)
    },

    renameFile: async (input) => {
        const validated = uploadsValidator.validateRenameFile(input)
        if (!validated.success) {
            throw validated.error
        }
        await UserServices.getCurrentUser()
        await UploadsWriteRepositoriesImpl.renameFile(validated.data)
    },
}
