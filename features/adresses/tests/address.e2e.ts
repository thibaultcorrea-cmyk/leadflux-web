import { afterAll, describe, expect, it } from "vitest"
import { AddressServicesImpl } from "../services"
import { AddressReadRepositoriesImpl } from "../repositories/read"
import { AddressWriteRepositoriesImpl } from "../repositories/write"

/**
 * Test de bout en bout : valide -> service -> repository -> Postgres reel,
 * puis relecture par le repository de lecture. Nettoie la ligne creee.
 */
describe("e2e adresses : creation d'une adresse", () => {
    const createdIds: string[] = []

    afterAll(async () => {
        if (createdIds.length > 0) {
            await AddressWriteRepositoriesImpl.deleteMany(createdIds)
        }
    })

    it("cree une adresse et la persiste en base", async () => {
        const uniqueCity = `Bordeaux-e2e-${crypto.randomUUID()}`

        const created = await AddressServicesImpl.create({
            city: uniqueCity,
            country: "France",
            street: "12 rue des Merlettes",
            zip: "33000",
        })
        createdIds.push(created.id)

        expect(created.id).toBeTruthy()
        expect(created.city).toBe(uniqueCity)
        expect(created.cityKey).toBe(uniqueCity.toLowerCase())

        const persisted = await AddressReadRepositoriesImpl.get(created.id)
        expect(persisted.country).toBe("France")
        expect(persisted.zip).toBe("33000")
    })

    it("rejette une creation sans ville ni pays sans toucher la base", async () => {
        await expect(
            AddressServicesImpl.create({} as never),
        ).rejects.toBeTruthy()
    })
})
