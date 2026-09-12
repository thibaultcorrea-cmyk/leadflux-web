import { beforeEach, describe, expect, it, vi } from "vitest"

const getCurrentUserMock = vi.fn()
const fileCreateMock = vi.fn()
const fileGetMock = vi.fn()

const createSessionMock = vi.fn()
const writeChunkMock = vi.fn()
const assembleMock = vi.fn()
const cleanupSessionMock = vi.fn()
const deleteFileMock = vi.fn()

const readSessionMetaMock = vi.fn()
const listReceivedChunksMock = vi.fn()
const readFileMock = vi.fn()

vi.mock("@/features/users/services", () => ({
    UserServices: {
        getCurrentUser: (...args: unknown[]) => getCurrentUserMock(...args),
    },
}))

vi.mock("@/features/files/services", () => ({
    FileServicesImpl: {
        create: (...args: unknown[]) => fileCreateMock(...args),
        get: (...args: unknown[]) => fileGetMock(...args),
    },
}))

vi.mock("../repositories/write", () => ({
    UploadsWriteRepositoriesImpl: {
        createSession: (...args: unknown[]) => createSessionMock(...args),
        writeChunk: (...args: unknown[]) => writeChunkMock(...args),
        assemble: (...args: unknown[]) => assembleMock(...args),
        cleanupSession: (...args: unknown[]) => cleanupSessionMock(...args),
        deleteFile: (...args: unknown[]) => deleteFileMock(...args),
    },
}))

vi.mock("../repositories/read", () => ({
    UploadsReadRepositoriesImpl: {
        readSessionMeta: (...args: unknown[]) => readSessionMetaMock(...args),
        listReceivedChunks: (...args: unknown[]) => listReceivedChunksMock(...args),
        readFile: (...args: unknown[]) => readFileMock(...args),
    },
}))

import { UploadsServicesImpl } from "../services"

describe("UploadsServicesImpl.createSession", () => {
    beforeEach(() => {
        getCurrentUserMock.mockReset().mockResolvedValue({ id: "user_1" })
        createSessionMock.mockReset().mockResolvedValue(undefined)
    })

    it("rejette un logo avec un mimeType hors regles", async () => {
        await expect(
            UploadsServicesImpl.createSession({
                fileName: "logo.svg",
                mimeType: "image/svg+xml",
                sizeBytes: 1024,
                totalChunks: 1,
                context: "logo",
            }),
        ).rejects.toThrow(/non autorise/)

        expect(createSessionMock).not.toHaveBeenCalled()
        expect(getCurrentUserMock).not.toHaveBeenCalled()
    })

    it("rejette un logo trop volumineux", async () => {
        await expect(
            UploadsServicesImpl.createSession({
                fileName: "logo.png",
                mimeType: "image/png",
                sizeBytes: 3 * 1024 * 1024,
                totalChunks: 1,
                context: "logo",
            }),
        ).rejects.toThrow(/trop volumineux/)
    })

    it("accepte un logo conforme et cree la session", async () => {
        const { uploadId } = await UploadsServicesImpl.createSession({
            fileName: "logo.png",
            mimeType: "image/png",
            sizeBytes: 1024,
            totalChunks: 1,
            context: "logo",
        })

        expect(uploadId).toBeTruthy()
        expect(getCurrentUserMock).toHaveBeenCalled()
        expect(createSessionMock).toHaveBeenCalledWith(
            expect.objectContaining({ extension: "png", fileName: "logo.png", context: "logo" }),
        )
    })
})

describe("UploadsServicesImpl.complete", () => {
    beforeEach(() => {
        readSessionMetaMock.mockReset().mockResolvedValue({
            uploadId: "upload-1",
            fileName: "logo.png",
            mimeType: "image/png",
            sizeBytes: 1024,
            totalChunks: 1,
            context: "logo",
            extension: "png",
            createdAt: new Date().toISOString(),
        })
        assembleMock.mockReset().mockResolvedValue({ size: 1024 })
        fileCreateMock.mockReset().mockImplementation((input) => Promise.resolve({ id: input.id, ...input }))
        cleanupSessionMock.mockReset().mockResolvedValue(undefined)
    })

    it("cree la ligne `files` avec l'uuid de la session reutilise comme id et le chemin <id>/<id>.<ext>", async () => {
        const result = await UploadsServicesImpl.complete({ uploadId: "upload-1" })

        expect(fileCreateMock).toHaveBeenCalledWith(
            expect.objectContaining({ id: "upload-1", path: "upload-1/upload-1.png", size: 1024 }),
        )
        expect(cleanupSessionMock).toHaveBeenCalledWith("upload-1")
        expect(result.id).toBe("upload-1")
    })
})

describe("UploadsServicesImpl.read", () => {
    beforeEach(() => {
        getCurrentUserMock.mockReset()
        fileGetMock.mockReset()
        readFileMock.mockReset()
    })

    it("propage l'echec d'authentification sans lire le fichier", async () => {
        getCurrentUserMock.mockRejectedValue(new Error("User not found"))

        await expect(UploadsServicesImpl.read("file-1")).rejects.toThrow("User not found")

        expect(fileGetMock).not.toHaveBeenCalled()
        expect(readFileMock).not.toHaveBeenCalled()
    })
})
