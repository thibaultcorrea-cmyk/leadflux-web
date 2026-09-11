
export type S3UploadResult = {
    key: string
    bucket: string
}

export type S3GetResult = {
    body: Buffer
    contentType?: string
}
