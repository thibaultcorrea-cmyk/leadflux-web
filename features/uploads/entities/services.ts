import type { Readable } from "node:stream"
import type { FileSqlInfer } from "@/db/schemas"
import { AbortUploadSessionDto, CompleteUploadSessionDto, CreateUploadSessionDto, DeleteFileDto, MoveFileDto, RenameFileDto, WriteFileDto, WriteUploadChunkDto } from "../dto/schema"



/**
 * Pas de create/collections/update/delete/deleteMany/clear generiques ici :
 * cette feature n'a pas de table dediee, le dossier tmp/ fait foi pour les
 * sessions en cours (cf. convention-code-metier.md, deviation documentee).
 * clearStorage n'est pas ce "clear" generique refuse ci-dessus : c'est une
 * operation distincte et volontairement exceptionnelle (hard reset complet
 * du disque), sans equivalent par entite.
 */
export type UploadsServices = {
    createSession: (input: CreateUploadSessionDto) => Promise<{ uploadId: string }>
    writeChunk: (input: WriteUploadChunkDto & { data: Buffer }) => Promise<{ chunkIndex: number; receivedChunks: number; totalChunks: number }>
    complete: (input: CompleteUploadSessionDto) => Promise<FileSqlInfer>
    abort: (input: AbortUploadSessionDto) => Promise<void>
    /** Lit un fichier deja stocke par son fileId (ligne `files`) : verifie l'auth, resout id/extension, renvoie le stream. */
    read: (fileId: string) => Promise<{ file: FileSqlInfer; stream: Readable }>
    /** Comme `read`, mais resolu par cle de stockage (files.path) plutot que par fileId : utilise par /api/v1/logo, qui resout cette cle depuis le reglage "logo" de l'utilisateur connecte. */
    readByPath: (path: string) => Promise<{ file: FileSqlInfer; stream: Readable }>
    /** Ecrit un fichier complet (non chunke) directement, sans passer par le protocole de session. */
    writeFile: (input: WriteFileDto & { data: Buffer }) => Promise<{ size: number }>
    /** Supprime un fichier deja stocke sur disque (n'agit pas sur la ligne `files`, cf. features/files). */
    deleteFile: (input: DeleteFileDto) => Promise<void>
    /** Deplace un fichier deja stocke vers un autre id/extension. */
    moveFile: (input: MoveFileDto) => Promise<void>
    /** Renomme (change l'extension d') un fichier deja stocke, sans changer son id. */
    renameFile: (input: RenameFileDto) => Promise<void>
    /** Vide tout le stockage disque (hard reset uniquement). */
    clearStorage: () => Promise<void>
}
