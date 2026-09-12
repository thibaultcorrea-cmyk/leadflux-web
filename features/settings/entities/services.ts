import { SettingsSqlInfer } from "@/db/schemas"
import { LogoSettingValueDto, SetSettingDto } from "../dto/schema"


export type SettingsServices = {
    initializeForUser: (userId: string) => Promise<SettingsSqlInfer>
    setForUser: (userId: string, input: SetSettingDto) => Promise<SettingsSqlInfer>
    setLogo: (userId: string, value: LogoSettingValueDto) => Promise<SettingsSqlInfer>
    set: (input: SetSettingDto) => Promise<SettingsSqlInfer>
    get: (key: string) => Promise<SettingsSqlInfer | undefined>
    collections: () => Promise<SettingsSqlInfer[]>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
