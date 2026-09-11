import type { Progress } from "@aws-sdk/lib-storage"

export type S3UploadResult = {
    key: string
    bucket: string
}

export type S3GetResult = {
    body: Buffer
    contentType?: string
}

export type S3UploadProgressListener = (progress: Progress) => void
