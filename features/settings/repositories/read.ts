import { db } from "@/db"
import { settings } from "@/db/schemas"
import { and, eq } from "drizzle-orm"
import { ISettingsReadRepository } from "../entities/repository"

export const SettingsReadRepositoriesImpl: ISettingsReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(settings).where(eq(settings.id, id))

        if (!result) {
            throw new Error("Settings not found")
        }

        return result
    },
    getByUserAndKey: async (userId: string, key: string) => {
        const [result] = await db.select().from(settings)
            .where(and(eq(settings.userId, userId), eq(settings.key, key)))

        return result
    },
    find: async (userId: string) => {
        return db.select().from(settings).where(eq(settings.userId, userId))
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
