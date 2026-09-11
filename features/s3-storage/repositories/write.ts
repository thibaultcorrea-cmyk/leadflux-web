import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client, S3_BUCKET } from "../client"
import { IS3StorageWriteRepository } from "../entities/repository"



export const S3StorageWriteRepositoriesImpl: IS3StorageWriteRepository = {
    upload: async ({ key, contentType, body }) => {
        await s3Client.send(new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            Body: body,
            ContentType: contentType,
        }))

        return { key, bucket: S3_BUCKET }
    },

    delete: async (key: string) => {
        await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }))
    },

    truncate: async () => {
        let continuationToken: string | undefined

        do {
            const listResult = await s3Client.send(new ListObjectsV2Command({
                Bucket: S3_BUCKET,
                ContinuationToken: continuationToken,
            }))

            const objects = (listResult.Contents ?? [])
                .filter((object) => object.Key !== undefined)
                .map((object) => ({ Key: object.Key! }))

            if (objects.length > 0) {
                // DeleteObjectsCommand accepte 1000 cles max par appel, comme
                // ListObjectsV2Command en retourne au plus 1000 par page : les
                // deux boucles restent alignees.
                await s3Client.send(new DeleteObjectsCommand({
                    Bucket: S3_BUCKET,
                    Delete: { Objects: objects },
                }))
            }

            continuationToken = listResult.IsTruncated ? listResult.NextContinuationToken : undefined
        } while (continuationToken)
    },
}
