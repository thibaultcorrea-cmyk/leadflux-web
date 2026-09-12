import { FileSqlInfer } from "@/db/schemas"
import { CreateFileDto } from "../dto/schema"

export type FileServices = {
    get: (id: string) => Promise<FileSqlInfer>
    getByPath: (path: string) => Promise<FileSqlInfer | undefined>
    create: (file: CreateFileDto) => Promise<FileSqlInfer>
    collections: (query: any) => Promise<FileSqlInfer[]>
    update: (file: Partial<FileSqlInfer>) => Promise<FileSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    clear: () => Promise<void>

}
