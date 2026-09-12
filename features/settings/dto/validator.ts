import { logoSettingValueSchema, setSettingSchema } from "./schema"


export const settingsValidator = {
    validateSet: (data: unknown) => setSettingSchema.safeParse(data),
    validateLogoValue: (data: unknown) => logoSettingValueSchema.safeParse(data),
}
