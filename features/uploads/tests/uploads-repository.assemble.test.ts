import { mkdtemp, readdir, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { UploadsReadRepositoriesImpl } from "../repositories/read"
import { UploadsWriteRepositoriesImpl } from "../repositories/write"

/**
 * Exerce le vrai systeme de fichiers (dossier temporaire via mkdtemp) plutot
 * que de mocker fs : c'est precisement l'assemblage disque que ces tests
 * doivent couvrir.
 */
describe("features/uploads repositories (fs reel)", () => {
    let storageRoot: string

    beforeEach(async () => {
        storageRoot = await mkdtemp(path.join(tmpdir(), "leadflux-uploads-test-"))
        process.env.UPLOADS_STORAGE_ROOT = storageRoot
    })

    afterEach(async () => {
        delete process.env.UPLOADS_STORAGE_ROOT
        await rm(storageRoot, { recursive: true, force: true })
    })

    const seedSession = async (uploadId: string, chunks: Buffer[]) => {
        await UploadsWriteRepositoriesImpl.createSession({
            uploadId,
            fileName: "fixture.txt",
            mimeType: "text/plain",
            sizeBytes: chunks.reduce((total, chunk) => total + chunk.byteLength, 0),
            totalChunks: chunks.length,
            context: "generic",
            extension: "txt",
            createdAt: new Date().toISOString(),
        })
        await Promise.all(chunks.map((data, chunkIndex) => UploadsWriteRepositoriesImpl.writeChunk({ uploadId, chunkIndex, data })))
    }

    it("assemble les chunks dans l'ordre et respecte la taille annoncee", async () => {
        const chunks = [Buffer.from("abc"), Buffer.from("def"), Buffer.from("ghi")]
        await seedSession("upload-1", chunks)

        const result = await UploadsWriteRepositoriesImpl.assemble({
            uploadId: "upload-1",
            id: "file-1",
            extension: "txt",
            totalChunks: chunks.length,
            expectedSizeBytes: 9,
        })

        expect(result.size).toBe(9)
        const stream = await UploadsReadRepositoriesImpl.readFile({ id: "file-1", extension: "txt" })
        const written = await new Promise<string>((resolve, reject) => {
            let data = ""
            stream.on("data", (chunk) => { data += chunk.toString() })
            stream.on("end", () => resolve(data))
            stream.on("error", reject)
        })
        expect(written).toBe("abcdefghi")
    })

    it("rejette et conserve tmp/ quand un chunk manque", async () => {
        await seedSession("upload-2", [Buffer.from("abc"), Buffer.from("def")])
        // Simule un chunk manquant : on annonce 3 chunks alors qu'un seul a ete ecrit pour l'index 1.
        await expect(
            UploadsWriteRepositoriesImpl.assemble({
                uploadId: "upload-2",
                id: "file-2",
                extension: "txt",
                totalChunks: 3,
                expectedSizeBytes: 9,
            }),
        ).rejects.toThrow(/Fragment manquant/)

        const meta = await UploadsReadRepositoriesImpl.readSessionMeta("upload-2")
        expect(meta.uploadId).toBe("upload-2")
    })

    it("reste idempotent si un chunk est renvoye deux fois (retry reseau)", async () => {
        await seedSession("upload-3", [Buffer.from("abc"), Buffer.from("def")])
        await UploadsWriteRepositoriesImpl.writeChunk({ uploadId: "upload-3", chunkIndex: 0, data: Buffer.from("abc") })

        const result = await UploadsWriteRepositoriesImpl.assemble({
            uploadId: "upload-3",
            id: "file-3",
            extension: "txt",
            totalChunks: 2,
            expectedSizeBytes: 6,
        })

        expect(result.size).toBe(6)
    })

    it("nettoie completement tmp/ sur abandon", async () => {
        await seedSession("upload-4", [Buffer.from("abc")])
        await UploadsWriteRepositoriesImpl.cleanupSession("upload-4")

        await expect(UploadsReadRepositoriesImpl.readSessionMeta("upload-4")).rejects.toThrow()
    })

    it("rejette et nettoie le .part quand la taille assemblee differe de celle annoncee", async () => {
        await seedSession("upload-5", [Buffer.from("abc"), Buffer.from("def")])

        await expect(
            UploadsWriteRepositoriesImpl.assemble({
                uploadId: "upload-5",
                id: "file-5",
                extension: "txt",
                totalChunks: 2,
                expectedSizeBytes: 999,
            }),
        ).rejects.toThrow(/Taille assemblee/)

        await expect(stat(path.join(storageRoot, "file-5", "file-5.txt.part"))).rejects.toThrow()
    })

    it("deleteFile est idempotent (pas d'erreur si le fichier n'existe pas)", async () => {
        await expect(UploadsWriteRepositoriesImpl.deleteFile({ id: "inexistant", extension: "txt" })).resolves.toBeUndefined()
    })

    it("deleteFile supprime le fichier final et son dossier", async () => {
        await seedSession("upload-6", [Buffer.from("abc")])
        await UploadsWriteRepositoriesImpl.assemble({
            uploadId: "upload-6",
            id: "file-6",
            extension: "txt",
            totalChunks: 1,
            expectedSizeBytes: 3,
        })

        await UploadsWriteRepositoriesImpl.deleteFile({ id: "file-6", extension: "txt" })

        await expect(readdir(path.join(storageRoot, "file-6"))).rejects.toThrow()
    })
})
