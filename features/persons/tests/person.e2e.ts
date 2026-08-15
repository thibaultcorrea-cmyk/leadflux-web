import { afterAll, describe, expect, it } from "vitest"
import { PersonServicesImpl } from "../services"
import { PersonReadRepositoriesImpl } from "../repositories/read"
import { PersonWriteRepositoriesImpl } from "../repositories/write"

/**
 * Test de bout en bout : valide -> service -> repository -> Postgres reel,
 * puis relecture par le repository de lecture. Nettoie la ligne creee.
 */
describe("e2e persons : creation d'une personne", () => {
    const createdIds: string[] = []

    afterAll(async () => {
        if (createdIds.length > 0) {
            await PersonWriteRepositoriesImpl.deleteMany(createdIds)
        }
    })

    it("cree une personne et la persiste en base", async () => {
        const uniqueEmail = `marion.aubert+${crypto.randomUUID()}@example.com`

        const created = await PersonServicesImpl.create({
            fullName: "Marion Aubert",
            email: uniqueEmail,
            jobTitle: "Directrice associee",
        })
        createdIds.push(created.id)

        expect(created.id).toBeTruthy()
        expect(created.email).toBe(uniqueEmail)
        expect(created.emailKey).toBe(uniqueEmail.toLowerCase())

        const persisted = await PersonReadRepositoriesImpl.get(created.id)
        expect(persisted.fullName).toBe("Marion Aubert")
        expect(persisted.jobTitle).toBe("Directrice associee")
    })

    it("rejette une creation sans email valide sans toucher la base", async () => {
        await expect(
            PersonServicesImpl.create({ fullName: "Marion Aubert", email: "invalide" }),
        ).rejects.toBeTruthy()
    })
})
