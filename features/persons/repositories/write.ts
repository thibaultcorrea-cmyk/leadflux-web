import { db } from "@/db"
import { persons, PersonSqlInfer, PersonSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { IPersonWriteRepository } from "../entities/repository"



export const PersonWriteRepositoriesImpl: IPersonWriteRepository = {
    create: async (data: PersonSqlInsert) => {
        const [result] = await db.insert(persons).values(data).returning()

        return result
    },

    update: async (data: Partial<PersonSqlInfer>): Promise<PersonSqlInfer> => {
        const [result] = await db.update(persons).set({
            ...data,

        }).where(eq(persons.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(persons).where(eq(persons.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(persons).where(inArray(persons.id, ids))
    },

    truncate: async () => {
        await db.delete(persons)
    },
}
