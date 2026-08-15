import { db } from "@/db"
import { emails } from "@/db/schemas"
import { desc, eq } from "drizzle-orm"
import { IEmailReadRepository } from "../entities/repository"
import { emailsMocks } from "../mocks/emails"

export const EmailReadRepositoriesImpl: IEmailReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(emails).where(eq(emails.id, id))

        if (!result) {
            throw new Error("Email not found")
        }

        return result
    },
    find: async (query: any) => {
        return emailsMocks
        //return db.select().from(emails).orderBy(desc(emails.lastActivityAt))
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
