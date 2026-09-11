import { S3Client } from "@aws-sdk/client-s3"
import { ENV } from "@/core/env"

/**
 * MinIO (docker-compose) parle le protocole S3 : forcePathStyle est
 * obligatoire (MinIO n'a pas de sous-domaine par bucket comme AWS), la region
 * est factice mais requise par le SDK.
 */
export const s3Client = new S3Client({
    endpoint: ENV.S3_ENDPOINT,
    region: ENV.S3_REGION,
    forcePathStyle: true,
    credentials: {
        accessKeyId: ENV.S3_ACCESS_KEY_ID,
        secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
    },
})

export const S3_BUCKET = ENV.S3_BUCKET
