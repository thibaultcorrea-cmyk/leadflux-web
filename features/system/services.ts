import { SystemWriteRepositoriesImpl } from "./repositories/write"
import { CurrentLogoFile, SystemServices } from "./entities/services"
import { UserServices } from "../users/services"
import { UploadsServicesImpl } from "../uploads/services"
import { SettingsServicesImpl } from "../settings/services"
import { LOGO_SETTING_KEY } from "../settings/dto/schema"
import { settingsValidator } from "../settings/dto/validator"

export const SystemServicesImpl: SystemServices = {
    currentLogo: async () => {
        // SettingsServicesImpl.get resout l'utilisateur courant depuis la
        // session : leve si personne n'est connecte.
        const setting = await SettingsServicesImpl.get(LOGO_SETTING_KEY)
        const validated = settingsValidator.validateLogoValue(setting?.value)

        if (!validated.success) {
            throw new Error("Aucun logo n'est configuré.")
        }
        const { file } = await UploadsServicesImpl.readByPath(validated.data.key)
        return {
            name: validated.data.name ?? file.originalName,
            height: validated.data.height ?? 0,
            width: validated.data.width ?? 0,
            key: validated.data.key ?? "",
            ...file,
        } satisfies CurrentLogoFile

    },

    clear: async () => {
        const isAdmin = await UserServices.isAdmin()
        if (!isAdmin) {
            throw new Error("Reserve aux administrateurs")
        }

        await SystemWriteRepositoriesImpl.truncate()
        await UploadsServicesImpl.clearStorage()
    },
}
