import { UserServices } from "../users/services"
import { LOGO_SETTING_KEY, LogoSettingValueDto, SetSettingDto } from "./dto/schema"
import { settingsValidator } from "./dto/validator"
import { SettingsReadRepositoriesImpl } from "./repositories/read"
import { SettingsWriteRepositoriesImpl } from "./repositories/write"
import { SettingsServices } from "./entities/services"

export const SettingsServicesImpl: SettingsServices = {
    initializeForUser: async (userId: string) => {
        return SettingsServicesImpl.setForUser(userId, { key: LOGO_SETTING_KEY, value: null })
    },

    // Upsert generique par cle : cree la ligne si (userId, key) n'existe pas
    // encore, la met a jour sinon (onConflictDoUpdate, cf. repositories/write.ts).
    setForUser: async (userId: string, input: SetSettingDto) => {
        const validated = settingsValidator.validateSet(input)
        if (!validated.success) {
            throw validated.error
        }

        const { data } = validated

        return SettingsWriteRepositoriesImpl.create({
            userId,
            key: data.key,
            value: data.value,
        })
    },

    setLogo: async (userId: string, value: LogoSettingValueDto) => {
        const validated = settingsValidator.validateLogoValue(value)
        if (!validated.success) {
            throw validated.error
        }

        return SettingsServicesImpl.setForUser(userId, { key: LOGO_SETTING_KEY, value: validated.data })
    },

    set: async (input: SetSettingDto) => {
        const currentUser = await UserServices.getCurrentUser()
        return SettingsServicesImpl.setForUser(currentUser.id, input)
    },

    get: async (key: string) => {
        const currentUser = await UserServices.getCurrentUser()
        return SettingsReadRepositoriesImpl.getByUserAndKey(currentUser.id, key)
    },

    collections: async () => {
        const currentUser = await UserServices.getCurrentUser()
        return SettingsReadRepositoriesImpl.find(currentUser.id)
    },

    delete: async (id: string) => {
        await SettingsWriteRepositoriesImpl.delete(id)
    },
    deleteMany: async (ids: string[]) => {
        await SettingsWriteRepositoriesImpl.deleteMany(ids)
    },
    clear: async () => {
        await SettingsWriteRepositoriesImpl.truncate()
    },
}
