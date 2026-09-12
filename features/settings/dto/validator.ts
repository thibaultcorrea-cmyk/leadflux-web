import { setSettingSchema } from "./schema"


export const settingsValidator = {
    validateSet: (data: unknown) => setSettingSchema.safeParse(data),
}
