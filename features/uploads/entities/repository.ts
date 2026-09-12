import type { Readable } from "node:stream"
import { UploadSessionMeta } from "./type"



export interface IUploadsReadRepository {
    readSessionMeta: (uploadId: string) => Promise<UploadSessionMeta>
    listReceivedChunks: (uploadId: string) => Promise<number[]>
    readFile: (params: { id: string; extension: string }) => Promise<Readable>
    fileExists: (params: { id: string; extension: string }) => Promise<boolean>
}

export interface IUploadsWriteRepository {
    createSession: (meta: UploadSessionMeta) => Promise<void>
    writeChunk: (params: { uploadId: string; chunkIndex: number; data: Buffer }) => Promise<void>
    /**
     * Concatene les chunks 0..totalChunks-1 dans <id>/<id>.<ext>. Rejette si un
     * chunk manque ou si la taille finale ne correspond pas a expectedSizeBytes.
     * Ne nettoie PAS tmp/ (fait par cleanupSession, appele par services.ts
     * uniquement apres un succes ou sur abandon explicite) : un echec doit
     * rester retry-able.
     */
    assemble: (params: { uploadId: string; id: string; extension: string; totalChunks: number; expectedSizeBytes: number }) => Promise<{ size: number }>
    cleanupSession: (uploadId: string) => Promise<void>
    /** Ecrit un fichier complet (non chunke) directement en <id>/<id>.<ext>. */
    writeFile: (params: { id: string; extension: string; data: Buffer }) => Promise<{ size: number }>
    /** Supprime <id>/<id>.<ext> (et son dossier s'il devient vide). Idempotent. */
    deleteFile: (params: { id: string; extension: string }) => Promise<void>
    /** Deplace <fromId>/<fromId>.<fromExt> vers <toId>/<toId>.<toExt>. */
    moveFile: (params: { fromId: string; fromExtension: string; toId: string; toExtension: string }) => Promise<void>
    /** Renomme (change l'extension) un fichier sans changer son id : cas particulier de moveFile. */
    renameFile: (params: { id: string; fromExtension: string; toExtension: string }) => Promise<void>
}
