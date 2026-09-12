import { UserServices } from "../users/services"
import { SetSettingDto } from "./dto/schema"
import { settingsValidator } from "./dto/validator"
import { SettingsReadRepositoriesImpl } from "./repositories/read"
import { SettingsWriteRepositoriesImpl } from "./repositories/write"
import { SettingsServices } from "./entities/services"

/** Cle du logo actif (cf. replace-logo-modal.tsx) : seul reglage existant a ce jour. */
const LOGO_SETTING_KEY = "logo"

export const SettingsServicesImpl: SettingsServices = {
    initializeForUser: async (userId: string) => {
        return SettingsWriteRepositoriesImpl.create({
            userId,
            key: LOGO_SETTING_KEY,
            value: null,
        })
    },

    set: async (input: SetSettingDto) => {
        const validated = settingsValidator.validateSet(input)
        if (!validated.success) {
            throw validated.error
        }

        const currentUser = await UserServices.getCurrentUser()
        const { data } = validated

        return SettingsWriteRepositoriesImpl.create({
            userId: currentUser.id,
            key: data.key,
            value: data.value,
        })
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
