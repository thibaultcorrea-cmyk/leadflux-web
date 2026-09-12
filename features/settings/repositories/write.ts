import { db } from "@/db"
import { settings, SettingsSqlInfer, SettingsSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { ISettingsWriteRepository } from "../entities/repository"


/**
 * create fait un onConflictDoUpdate sur (user_id, key) : ecrire une cle deja
 * presente pour l'utilisateur met a jour sa valeur plutot que de dupliquer la
 * ligne (contrainte settings_user_key_uidx, cf. db/schemas/settings.ts).
 */
export const SettingsWriteRepositoriesImpl: ISettingsWriteRepository = {
    create: async (data: SettingsSqlInsert) => {
        const [result] = await db.insert(settings).values(data)
            .onConflictDoUpdate({
                target: [settings.userId, settings.key],
                set: { value: data.value },
            })
            .returning()

        return result
    },

    update: async (data: Partial<SettingsSqlInfer>): Promise<SettingsSqlInfer> => {
        const [result] = await db.update(settings).set({
            ...data,

        }).where(eq(settings.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(settings).where(eq(settings.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(settings).where(inArray(settings.id, ids))
    },

    truncate: async () => {
        await db.delete(settings)
    },
}
