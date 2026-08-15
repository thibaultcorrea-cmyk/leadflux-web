import { db } from "@/db"
import { companies, CompanySqlInfer, CompanySqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { ICompanyWriteRepository } from "../entities/repository"



export const CompanyWriteRepositoriesImpl: ICompanyWriteRepository = {
    create: async (data: CompanySqlInsert) => {
        const [result] = await db.insert(companies).values(data).returning()

        return result
    },

    update: async (data: Partial<CompanySqlInfer>): Promise<CompanySqlInfer> => {
        const [result] = await db.update(companies).set({
            ...data,

        }).where(eq(companies.id, data.id!)).returning()

        return result
    },

    delete: async (id: string) => {
        await db.delete(companies).where(eq(companies.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(companies).where(inArray(companies.id, ids))
    },

    truncate: async () => {
        await db.delete(companies)
    },
}
