import { SystemWriteRepositoriesImpl } from "./repositories/write"
import { SystemServices } from "./entities/services"
import { UserServices } from "../users/services"

export const SystemServicesImpl: SystemServices = {
    clear: async () => {
        const isAdmin = await UserServices.isAdmin()
        if (!isAdmin) {
            throw new Error("Reserve aux administrateurs")
        }

        await SystemWriteRepositoriesImpl.truncate()
    },
}
