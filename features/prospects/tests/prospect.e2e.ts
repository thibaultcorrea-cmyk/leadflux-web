import { afterAll, describe, expect, it } from "vitest"
import { ProspectServicesImpl } from "../services"
import { ProspectReadRepositoriesImpl } from "../repositories/read"
import { PersonWriteRepositoriesImpl } from "@/features/persons/repositories/write"
import { CompanyWriteRepositoriesImpl } from "@/features/companies/repositories/write"

/**
 * Test de bout en bout : valide -> service -> repository -> Postgres reel.
 * truncate n'est volontairement pas exerce ici (destructif pour toute la
 * table) : il est couvert par le test unitaire avec repository mocke.
 */
describe("e2e prospects : creation et suppression d'un prospect", () => {
    const createdPersonIds: string[] = []
    const createdCompanyIds: string[] = []

    afterAll(async () => {
        if (createdPersonIds.length > 0) {
            await PersonWriteRepositoriesImpl.deleteMany(createdPersonIds)
        }
        if (createdCompanyIds.length > 0) {
            await CompanyWriteRepositoriesImpl.deleteMany(createdCompanyIds)
        }
    })

    const createPersonAndCompany = async (suffix: string) => {
        const person = await PersonWriteRepositoriesImpl.create({
            fullName: `Prospect Test ${suffix}`,
            email: `prospect.e2e+${suffix}@example.com`,
            emailKey: `prospect.e2e+${suffix}@example.com`,
        })
        createdPersonIds.push(person.id)

        const company = await CompanyWriteRepositoriesImpl.create({
            name: `Entreprise e2e ${suffix}`,
            nameKey: `entreprise e2e ${suffix}`,
        })
        createdCompanyIds.push(company.id)

        return { person, company }
    }

    it("cree un prospect et le persiste en base", async () => {
        const { person, company } = await createPersonAndCompany(crypto.randomUUID())

        const created = await ProspectServicesImpl.create({
            personId: person.id,
            companyId: company.id,
        })

        expect(created.id).toBeTruthy()
        expect(created.personId).toBe(person.id)
        expect(created.companyId).toBe(company.id)

        const persisted = await ProspectReadRepositoriesImpl.get(created.id)
        expect(persisted.companyId).toBe(company.id)
    })

    it("supprime un prospect existant", async () => {
        const { person, company } = await createPersonAndCompany(crypto.randomUUID())
        const created = await ProspectServicesImpl.create({ personId: person.id, companyId: company.id })

        await ProspectServicesImpl.delete(created.id)

        await expect(ProspectReadRepositoriesImpl.get(created.id)).rejects.toBeTruthy()
    })

    it("supprime plusieurs prospects a la fois", async () => {
        const first = await createPersonAndCompany(crypto.randomUUID())
        const second = await createPersonAndCompany(crypto.randomUUID())

        const createdFirst = await ProspectServicesImpl.create({ personId: first.person.id, companyId: first.company.id })
        const createdSecond = await ProspectServicesImpl.create({ personId: second.person.id, companyId: second.company.id })

        await ProspectServicesImpl.deleteMultiple([createdFirst.id, createdSecond.id])

        await expect(ProspectReadRepositoriesImpl.get(createdFirst.id)).rejects.toBeTruthy()
        await expect(ProspectReadRepositoriesImpl.get(createdSecond.id)).rejects.toBeTruthy()
    })

    it("rejette une creation sans personId ni companyId sans toucher la base", async () => {
        await expect(ProspectServicesImpl.create({} as never)).rejects.toBeTruthy()
    })
})
