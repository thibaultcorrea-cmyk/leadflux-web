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

/** S3 refuse toute part sous 5 Mo (sauf la derniere) : @aws-sdk/lib-storage applique la meme limite. */
export const S3_MIN_PART_SIZE_BYTES = 5 * 1024 * 1024
