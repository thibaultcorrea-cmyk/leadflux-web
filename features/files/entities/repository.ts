import { FileSqlInfer, FileSqlInsert } from "@/db/schemas"



export interface IFileReadRepository {
    get: (id: string) => Promise<FileSqlInfer>
    getByPath: (path: string) => Promise<FileSqlInfer | undefined>
    find: (query: any) => Promise<FileSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface IFileWriteRepository {
    create: (file: FileSqlInsert) => Promise<FileSqlInfer>
    update: (file: Partial<FileSqlInfer>) => Promise<FileSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
