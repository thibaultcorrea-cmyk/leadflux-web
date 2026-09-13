import { FileSqlInfer } from "@/db/schemas"



export type CurrentLogoFile = FileSqlInfer & { name: string, height: number, width: number, key: string }

export type SystemServices = {
    /** Recupere le logo actuel de l'utilisateur connecte */
    currentLogo: () => Promise<CurrentLogoFile>
    clear: () => Promise<void>
}
