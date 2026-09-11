import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Client, S3_BUCKET } from "../client"
import { IS3StorageReadRepository } from "../entities/repository"

const DEFAULT_PRESIGN_EXPIRES_IN_SECONDS = 900



export const S3StorageReadRepositoriesImpl: IS3StorageReadRepository = {
    presign: async ({ key, expiresInSeconds }) => {
        const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key })

        return getSignedUrl(s3Client, command, {
            expiresIn: expiresInSeconds ?? DEFAULT_PRESIGN_EXPIRES_IN_SECONDS,
        })
    },
    get: async (key: string) => {
        const result = await s3Client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }))

        if (!result.Body) {
            throw new Error("File not found")
        }

        const body = Buffer.from(await result.Body.transformToByteArray())

        return { body, contentType: result.ContentType }
    },
}
