import { PresignFileDto, UploadFileDto } from "../dto/schema"
import { S3GetResult, S3UploadResult } from "./type"



export interface IS3StorageReadRepository {
    presign: (input: PresignFileDto) => Promise<string>
    get: (key: string) => Promise<S3GetResult>

}

export interface IS3StorageWriteRepository {
    upload: (input: UploadFileDto & { body: Buffer }) => Promise<S3UploadResult>
    delete: (key: string) => Promise<void>
    /** Vide entierement le bucket (tous les objets, pagine). */
    truncate: () => Promise<void>

}
