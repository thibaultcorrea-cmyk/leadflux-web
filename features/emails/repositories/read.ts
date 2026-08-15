import { db } from "@/db"
import { emails } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { IEmailReadRepository } from "../entities/repository"

export const EmailReadRepositoriesImpl: IEmailReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(emails).where(eq(emails.id, id))

        if (!result) {
            throw new Error("Email not found")
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
