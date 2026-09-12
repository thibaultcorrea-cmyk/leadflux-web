import { UploadContext } from "../dto/schema"

/**
 * Forme du sidecar meta.json ecrit a la creation d'une session (storage/tmp/<uploadId>/meta.json).
 * Pas de table DB dediee aux sessions en cours : ce fichier + les chunks presents
 * sur disque font foi (cf. features/uploads/services.ts).
 */
export type UploadSessionMeta = {
    uploadId: string
    fileName: string
    mimeType: string
    sizeBytes: number
    totalChunks: number
    context: UploadContext
    extension: string
    createdAt: string
}
