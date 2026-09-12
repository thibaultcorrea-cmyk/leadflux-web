import {
    abortUploadSessionSchema,
    completeUploadSessionSchema,
    createUploadSessionSchema,
    deleteFileSchema,
    moveFileSchema,
    renameFileSchema,
    writeFileSchema,
    writeUploadChunkSchema,
} from "./schema"



export const uploadsValidator = {
    validateCreate: (data: unknown) => createUploadSessionSchema.safeParse(data),
    validateWriteChunk: (data: unknown) => writeUploadChunkSchema.safeParse(data),
    validateComplete: (data: unknown) => completeUploadSessionSchema.safeParse(data),
    validateAbort: (data: unknown) => abortUploadSessionSchema.safeParse(data),
    validateWriteFile: (data: unknown) => writeFileSchema.safeParse(data),
    validateDeleteFile: (data: unknown) => deleteFileSchema.safeParse(data),
    validateMoveFile: (data: unknown) => moveFileSchema.safeParse(data),
    validateRenameFile: (data: unknown) => renameFileSchema.safeParse(data),
}
