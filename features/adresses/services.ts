import { CreateAddressDto } from "./dto/schema"
import { addressValidator } from "./dto/validator"
import { AddressWriteRepositoriesImpl } from "./repositories/write"
import { AddressServices } from "./entities/services"



export const AddressServicesImpl: AddressServices = {
    create: async (input: CreateAddressDto) => {
        const validated = addressValidator.validate(input)
        if (!validated.success) {
            throw validated.error
        }

        const { data } = validated
        const cityKey = cityKeyFactory(data.city)

        return AddressWriteRepositoriesImpl.create({
            ...data,
            cityKey,
        })
    },

    collections: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    update: async (address) => {
        throw new Error("Method not implemented.")
    },
    delete: async (id: string) => {
        throw new Error("Method not implemented.")
    },
    deleteMultiple: async (ids: string[]) => {
        throw new Error("Method not implemented.")
    },
    truncate: async () => {
        throw new Error("Method not implemented.")
    },
}

const cityKeyFactory = (city: string) => city.trim().toLowerCase()
