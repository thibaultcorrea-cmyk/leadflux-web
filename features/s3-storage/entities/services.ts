import type { Readable } from "node:stream"
import { PresignFileDto, UploadFileDto } from "../dto/schema"
import { S3GetResult, S3UploadResult } from "./type"

export type S3StorageServices = {
    upload: (input: UploadFileDto & { body: Buffer }) => Promise<S3UploadResult>
    /** Upload multipart avec suivi de progression logue automatiquement (cf. services.ts). */
    uploadMultipart: (input: UploadFileDto & { body: Buffer | Readable }) => Promise<S3UploadResult>
    presign: (input: PresignFileDto) => Promise<string>
    get: (key: string) => Promise<S3GetResult>
    delete: (key: string) => Promise<void>
    clear: () => Promise<void>

}
