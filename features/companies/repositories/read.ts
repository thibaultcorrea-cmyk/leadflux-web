import { db } from "@/db"
import { companies } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { ICompanyReadRepository } from "../entities/repository"

export const CompanyReadRepositoriesImpl: ICompanyReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(companies).where(eq(companies.id, id))

        if (!result) {
            throw new Error("Company not found")
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
