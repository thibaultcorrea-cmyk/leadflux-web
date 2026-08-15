import { afterAll, describe, expect, it } from "vitest"
import { CompanyServicesImpl } from "../services"
import { CompanyReadRepositoriesImpl } from "../repositories/read"
import { CompanyWriteRepositoriesImpl } from "../repositories/write"
import { AddressServicesImpl } from "@/features/adresses/services"
import { AddressWriteRepositoriesImpl } from "@/features/adresses/repositories/write"

/**
 * Test de bout en bout : valide -> service -> repository -> Postgres reel,
 * puis relecture par le repository de lecture. Nettoie les lignes creees
 * (entreprise puis adresse, dans cet ordre a cause de la FK address_id).
 */
describe("e2e companies : creation d'une entreprise", () => {
    const createdCompanyIds: string[] = []
    const createdAddressIds: string[] = []

    afterAll(async () => {
        if (createdCompanyIds.length > 0) {
            await CompanyWriteRepositoriesImpl.deleteMany(createdCompanyIds)
        }
        if (createdAddressIds.length > 0) {
            await AddressWriteRepositoriesImpl.deleteMany(createdAddressIds)
        }
    })

    it("cree une entreprise rattachee a une adresse et la persiste en base", async () => {
        const uniqueSuffix = crypto.randomUUID()
        const address = await AddressServicesImpl.create({
            city: `Dijon-e2e-${uniqueSuffix}`,
            country: "France",
        })
        createdAddressIds.push(address.id)

        const uniqueName = `Aubert Strategie e2e ${uniqueSuffix}`
        const created = await CompanyServicesImpl.create({
            name: uniqueName,
            city: address.city!,
            addressId: address.id,
            industryRaw: "Conseil (strategie, RH, IA)",
            sizeRaw: "3-8 employes",
            headcountMin: 3,
            headcountMax: 8,
        })
        createdCompanyIds.push(created.id)

        expect(created.id).toBeTruthy()
        expect(created.nameKey).toBe(uniqueName.toLowerCase())
        expect(created.addressId).toBe(address.id)

        const persisted = await CompanyReadRepositoriesImpl.get(created.id)
        expect(persisted.name).toBe(uniqueName)
        expect(persisted.headcountMin).toBe(3)
        expect(persisted.headcountMax).toBe(8)
    })

    it("rejette une creation sans nom sans toucher la base", async () => {
        await expect(
            CompanyServicesImpl.create({} as never),
        ).rejects.toBeTruthy()
    })
})
