import { db } from "@/db"
import { files } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { IFileReadRepository } from "../entities/repository"

export const FileReadRepositoriesImpl: IFileReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(files).where(eq(files.id, id))

        if (!result) {
            throw new Error("File not found")
        }

        return result
    },
    getByPath: async (path: string) => {
        const [result] = await db.select().from(files).where(eq(files.path, path))

        return result
    },
    find: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
