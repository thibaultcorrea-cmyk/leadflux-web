import { db } from "@/db"
import { persons } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { IPersonReadRepository } from "../entities/repository"

export const PersonReadRepositoriesImpl: IPersonReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(persons).where(eq(persons.id, id))

        if (!result) {
            throw new Error("Person not found")
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
