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
