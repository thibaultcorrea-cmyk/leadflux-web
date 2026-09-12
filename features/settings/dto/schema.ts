import * as z from "zod"

export const SettingsSchema = z.object({
    id: z.string(),
    userId: z.string(),
    key: z.string(),
    value: z.json().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Settings = z.infer<typeof SettingsSchema>


export const setSettingSchema = z.object({
    key: z.string().min(1, "La clé est requise"),
    value: z.json().nullable(),
})

export type SetSettingDto = z.infer<typeof setSettingSchema>


/** Nom de la cle du reglage logo, cf. replace-logo-modal.tsx. */
export const LOGO_SETTING_KEY = "logo"

/**
 * Forme de `value` specifique a la cle "logo" : `key` designe ici la cle de
 * stockage du fichier (S3/MinIO), pas la cle du reglage (cf. files.path dans
 * db/schemas/files.ts). Chaque reglage a sa propre forme de valeur ; celle-ci
 * est la seule a ce jour.
 */
export const logoSettingValueSchema = z.object({
    key: z.string().min(1, "La clé de stockage du logo est requise"),
})

export type LogoSettingValueDto = z.infer<typeof logoSettingValueSchema>
