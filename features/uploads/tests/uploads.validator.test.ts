import { describe, expect, it } from "vitest"
import { uploadsValidator } from "../dto/validator"

describe("uploadsValidator.validateCreate", () => {
    it("accepte une session valide", () => {
        const result = uploadsValidator.validateCreate({
            fileName: "logo.png",
            mimeType: "image/png",
            sizeBytes: 1024,
            totalChunks: 1,
            context: "logo",
        })
        expect(result.success).toBe(true)
    })

    it("rejette un fileName vide", () => {
        const result = uploadsValidator.validateCreate({
            fileName: "",
            mimeType: "image/png",
            sizeBytes: 1024,
            totalChunks: 1,
            context: "logo",
        })
        expect(result.success).toBe(false)
    })

    it("rejette sizeBytes <= 0", () => {
        const result = uploadsValidator.validateCreate({
            fileName: "logo.png",
            mimeType: "image/png",
            sizeBytes: 0,
            totalChunks: 1,
            context: "logo",
        })
        expect(result.success).toBe(false)
    })

    it("rejette totalChunks <= 0", () => {
        const result = uploadsValidator.validateCreate({
            fileName: "logo.png",
            mimeType: "image/png",
            sizeBytes: 1024,
            totalChunks: 0,
            context: "logo",
        })
        expect(result.success).toBe(false)
    })

    it("rejette un context inconnu", () => {
        const result = uploadsValidator.validateCreate({
            fileName: "logo.png",
            mimeType: "image/png",
            sizeBytes: 1024,
            totalChunks: 1,
            context: "avatar",
        })
        expect(result.success).toBe(false)
    })
})

describe("uploadsValidator.validateWriteChunk", () => {
    it("accepte un chunk valide", () => {
        const result = uploadsValidator.validateWriteChunk({ uploadId: "upload-1", chunkIndex: 0 })
        expect(result.success).toBe(true)
    })

    it("rejette un chunkIndex negatif", () => {
        const result = uploadsValidator.validateWriteChunk({ uploadId: "upload-1", chunkIndex: -1 })
        expect(result.success).toBe(false)
    })

    it("rejette un uploadId vide", () => {
        const result = uploadsValidator.validateWriteChunk({ uploadId: "", chunkIndex: 0 })
        expect(result.success).toBe(false)
    })
})

describe("uploadsValidator.validateComplete / validateAbort", () => {
    it("accepte un uploadId non vide", () => {
        expect(uploadsValidator.validateComplete({ uploadId: "upload-1" }).success).toBe(true)
        expect(uploadsValidator.validateAbort({ uploadId: "upload-1" }).success).toBe(true)
    })

    it("rejette un uploadId vide", () => {
        expect(uploadsValidator.validateComplete({ uploadId: "" }).success).toBe(false)
        expect(uploadsValidator.validateAbort({ uploadId: "" }).success).toBe(false)
    })
})

describe("uploadsValidator.validateDeleteFile / validateMoveFile / validateRenameFile", () => {
    const validUuid = "5c1f2b1a-6e2e-4b8a-9b0a-5f2e6d1a2b3c"
    const otherUuid = "6d2f3b2a-7f3f-4c9b-8c1b-6a3f7e2b3c4d"

    it("accepte des identifiants uuid valides", () => {
        expect(uploadsValidator.validateDeleteFile({ id: validUuid, extension: "png" }).success).toBe(true)
        expect(
            uploadsValidator.validateMoveFile({
                fromId: validUuid,
                fromExtension: "png",
                toId: otherUuid,
                toExtension: "png",
            }).success,
        ).toBe(true)
        expect(
            uploadsValidator.validateRenameFile({ id: validUuid, fromExtension: "png", toExtension: "webp" }).success,
        ).toBe(true)
    })

    it("rejette un id non-uuid", () => {
        expect(uploadsValidator.validateDeleteFile({ id: "not-a-uuid", extension: "png" }).success).toBe(false)
    })
})
