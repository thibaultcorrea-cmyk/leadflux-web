import { SettingsSqlInfer, SettingsSqlInsert } from "@/db/schemas"


export interface ISettingsReadRepository {
    get: (id: string) => Promise<SettingsSqlInfer>
    getByUserAndKey: (userId: string, key: string) => Promise<SettingsSqlInfer | undefined>
    find: (query: any) => Promise<SettingsSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface ISettingsWriteRepository {
    create: (setting: SettingsSqlInsert) => Promise<SettingsSqlInfer>
    update: (setting: Partial<SettingsSqlInfer>) => Promise<SettingsSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
