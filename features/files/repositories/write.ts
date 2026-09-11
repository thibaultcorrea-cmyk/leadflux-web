import { db } from "@/db"
import { files, FileSqlInfer, FileSqlInsert } from "@/db/schemas"
import { eq, inArray } from "drizzle-orm"
import { IFileWriteRepository } from "../entities/repository"



export const FileWriteRepositoriesImpl: IFileWriteRepository = {
    create: async (data: FileSqlInsert) => {
        const [result] = await db.insert(files).values(data).returning()
        return result
    },

    update: async (data: Partial<FileSqlInfer>): Promise<FileSqlInfer> => {
        const [result] = await db.update(files).set({
            ...data,
        }).where(eq(files.id, data.id!)).returning()
        return result
    },

    delete: async (id: string) => {
        await db.delete(files).where(eq(files.id, id))
    },
    deleteMany: async (ids: string[]) => {
        await db.delete(files).where(inArray(files.id, ids))
    },

    truncate: async () => {
        await db.delete(files)
    },
}
