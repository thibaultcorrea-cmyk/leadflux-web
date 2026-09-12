import { FileSqlInfer } from "@/db/schemas"

export type SystemServices = {
    /** Recupere le logo actuel de l'utilisateur connecte */
    currentLogo: () => Promise<FileSqlInfer>
    clear: () => Promise<void>
}
