import type { Readable } from "node:stream"
import { PresignFileDto, UploadFileDto } from "../dto/schema"
import { S3GetResult, S3UploadProgressListener, S3UploadResult } from "./type"



export interface IS3StorageReadRepository {
    presign: (input: PresignFileDto) => Promise<string>
    get: (key: string) => Promise<S3GetResult>

}

export interface IS3StorageWriteRepository {
    upload: (input: UploadFileDto & { body: Buffer }) => Promise<S3UploadResult>
    /** Upload multipart (gros fichiers) : decoupe et envoie les parts en parallele, onProgress est notifie a chaque part envoyee. */
    uploadMultipart: (input: UploadFileDto & { body: Buffer | Readable }, onProgress?: S3UploadProgressListener) => Promise<S3UploadResult>
    delete: (key: string) => Promise<void>
    /** Vide entierement le bucket (tous les objets, pagine). */
    truncate: () => Promise<void>

}
