import * as z from "zod"



export const UPLOAD_CONTEXTS = ["logo", "knowledge-base", "generic"] as const
export type UploadContext = (typeof UPLOAD_CONTEXTS)[number]



export const createUploadSessionSchema = z.object({
    fileName: z.string().min(1, "fileName est requis"),
    mimeType: z.string().min(1, "mimeType est requis"),
    sizeBytes: z.number().positive("sizeBytes doit etre positif"),
    totalChunks: z.number().int().positive("totalChunks doit etre positif"),
    context: z.enum(UPLOAD_CONTEXTS),
})

export type CreateUploadSessionDto = z.infer<typeof createUploadSessionSchema>



export const writeUploadChunkSchema = z.object({
    uploadId: z.string().min(1, "uploadId est requis"),
    chunkIndex: z.number().int().nonnegative("chunkIndex doit etre >= 0"),
})

export type WriteUploadChunkDto = z.infer<typeof writeUploadChunkSchema>



export const completeUploadSessionSchema = z.object({
    uploadId: z.string().min(1, "uploadId est requis"),
})

export type CompleteUploadSessionDto = z.infer<typeof completeUploadSessionSchema>



export const abortUploadSessionSchema = completeUploadSessionSchema

export type AbortUploadSessionDto = z.infer<typeof abortUploadSessionSchema>



export const writeFileSchema = z.object({
    id: z.string().uuid("id doit etre un uuid"),
    extension: z.string().min(1, "extension est requise"),
})

export type WriteFileDto = z.infer<typeof writeFileSchema>



export const deleteFileSchema = z.object({
    id: z.string().uuid("id doit etre un uuid"),
    extension: z.string().min(1, "extension est requise"),
})

export type DeleteFileDto = z.infer<typeof deleteFileSchema>



export const moveFileSchema = z.object({
    fromId: z.string().uuid("fromId doit etre un uuid"),
    fromExtension: z.string().min(1, "fromExtension est requise"),
    toId: z.string().uuid("toId doit etre un uuid"),
    toExtension: z.string().min(1, "toExtension est requise"),
})

export type MoveFileDto = z.infer<typeof moveFileSchema>



export const renameFileSchema = z.object({
    id: z.string().uuid("id doit etre un uuid"),
    fromExtension: z.string().min(1, "fromExtension est requise"),
    toExtension: z.string().min(1, "toExtension est requise"),
})

export type RenameFileDto = z.infer<typeof renameFileSchema>
