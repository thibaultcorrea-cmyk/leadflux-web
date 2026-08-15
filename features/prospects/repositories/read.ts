import { db } from "@/db"
import { prospects } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { IProspectReadRepository } from "../entities/repository"

export const ProspectReadRepositoriesImpl: IProspectReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(prospects).where(eq(prospects.id, id))

        if (!result) {
            throw new Error("Prospect not found")
        }

        return result
    },
    find: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
