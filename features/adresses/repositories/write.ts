import { db } from "@/db"
import { addresses, AddressSqlInfer, AddressSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { IAddressWriteRepository } from "../entities/repository"



export const AddressWriteRepositoriesImpl: IAddressWriteRepository = {
    create: async (data: AddressSqlInsert) => {
        const [result] = await db.insert(addresses).values(data).returning()

        return result
    },

    update: async (data: Partial<AddressSqlInfer>): Promise<AddressSqlInfer> => {
        const [result] = await db.update(addresses).set({
            ...data,

        }).where(eq(addresses.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(addresses).where(eq(addresses.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(addresses).where(inArray(addresses.id, ids))
    },

    truncate: async () => {
        await db.delete(addresses)
    },
}
