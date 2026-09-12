import path from "node:path"
import { ENV } from "@/core/env"



/**
 * Lue depuis process.env a chaque appel (pas figee dans une const module-level) :
 * permet aux tests de surcharger UPLOADS_STORAGE_ROOT (dossier temporaire via
 * mkdtemp) sans recharger le module. ENV.UPLOADS_STORAGE_ROOT ne sert que de
 * valeur par defaut documentee/centralisee.
 */
export const getUploadsStorageRoot = () => {
    const configured = process.env.UPLOADS_STORAGE_ROOT ?? ENV.UPLOADS_STORAGE_ROOT
    // turbopackIgnore : ce path.join resout un dossier de stockage runtime
    // (jamais un module a importer). Sans cette annotation, le tracing de
    // fichiers de Next (NFT, utilise par `output: "standalone"`) interprete
    // ce chemin dynamique comme un pattern pouvant matcher tout le projet et
    // tente de tracer l'integralite du repo.
    return path.isAbsolute(configured) ? configured : path.join(/* turbopackIgnore: true */ process.cwd(), configured)
}

export const uploadsTmpDir = (uploadId: string) => path.join(/* turbopackIgnore: true */ getUploadsStorageRoot(), "tmp", uploadId)
export const uploadsChunksDir = (uploadId: string) => path.join(/* turbopackIgnore: true */ uploadsTmpDir(uploadId), "chunks")
export const uploadsChunkPath = (uploadId: string, chunkIndex: number) => path.join(/* turbopackIgnore: true */ uploadsChunksDir(uploadId), String(chunkIndex))
export const uploadsMetaPath = (uploadId: string) => path.join(/* turbopackIgnore: true */ uploadsTmpDir(uploadId), "meta.json")
export const uploadsFinalDir = (id: string) => path.join(/* turbopackIgnore: true */ getUploadsStorageRoot(), id)
export const uploadsFinalPath = (id: string, extension: string) => path.join(/* turbopackIgnore: true */ uploadsFinalDir(id), `${id}.${extension}`)
