import { db } from "@/db"
import { addresses, companies, persons, prospects } from "@/db/schemas"
import { eq } from "drizzle-orm"
import { IProspectReadRepository } from "../entities/repository"
import { TProspectWithRelations } from "../entities/type"

export const ProspectReadRepositoriesImpl: IProspectReadRepository = {
    get: async (id: string) => {
        const [result] = await db.select().from(prospects).where(eq(prospects.id, id))

        if (!result) {
            throw new Error("Prospect not found")
        }

        return result
    },
    getWithRelations: async (id: string) => {
        const [result] = await db.select({
            id: prospects.id,
            company: {
                id: companies.id,
                name: companies.name,
                description: companies.description,
                website: companies.website,
                industry: companies.industryRaw,
                size: companies.sizeRaw,
            },
            person: {
                id: persons.id,
                fullName: persons.fullName,
                email: persons.email,
                linkedinUrl: persons.linkedinUrl,
                phone: persons.phone,
                jobTitle: persons.jobTitle,

            },
            address: {
                id: addresses.id,
                city: addresses.city,
                country: addresses.country,
                zipCode: addresses.zip,
                state: addresses.state,
                street: addresses.street,
            },


        }).from(prospects).where(eq(prospects.id, id)).leftJoin(persons, eq(prospects.personId, persons.id)).leftJoin(companies, eq(prospects.companyId, companies.id))
            .leftJoin(addresses, eq(companies.addressId, addresses.id))

        if (!result) {
            throw new Error("Prospect not found")
        }

        return result as TProspectWithRelations
    },
    find: async (query: any) => {
        throw new Error("Method not implemented.")
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.")
    },

}
