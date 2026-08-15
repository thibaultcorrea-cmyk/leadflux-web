import { AddressSqlInfer, AddressSqlInsert } from "@/db/schemas"




export interface IAddressReadRepository {
    get: (id: string) => Promise<AddressSqlInfer>
    find: (query: any) => Promise<AddressSqlInfer[]>
    count?: (query: any) => Promise<number>

}

export interface IAddressWriteRepository {
    create: (address: AddressSqlInsert) => Promise<AddressSqlInfer>
    update: (address: Partial<AddressSqlInfer>) => Promise<AddressSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMany: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
