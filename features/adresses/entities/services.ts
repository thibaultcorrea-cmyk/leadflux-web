import { AddressSqlInfer } from "@/db/schemas"
import { CreateAddressDto } from "../dto/schema"


export type AddressServices = {
    create: (address: CreateAddressDto) => Promise<AddressSqlInfer>
    collections: (query: any) => Promise<AddressSqlInfer[]>
    update: (address: Partial<AddressSqlInfer>) => Promise<AddressSqlInfer>
    delete: (id: string) => Promise<void>
    deleteMultiple: (ids: string[]) => Promise<void>
    truncate: () => Promise<void>

}
