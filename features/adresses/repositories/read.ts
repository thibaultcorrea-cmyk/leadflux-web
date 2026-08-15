import { db } from "@/db"
import { addresses } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { IAddressReadRepository } from "../entities/repository"

export const AddressReadRepositoriesImpl: IAddressReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(addresses).where(eq(addresses.id, id))

        if (!result) {
            throw new Error("Address not found")
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
