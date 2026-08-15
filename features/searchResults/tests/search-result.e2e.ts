import { afterAll, describe, expect, it } from "vitest"
import { SearchResultServicesImpl } from "../services"
import { SearchResultReadRepositoriesImpl } from "../repositories/read"
import { SearchResultWriteRepositoriesImpl } from "../repositories/write"
import { SearchWriteRepositoriesImpl } from "@/features/search/repositories/write"
import { ProspectWriteRepositoriesImpl } from "@/features/prospects/repositories/write"
import { PersonWriteRepositoriesImpl } from "@/features/persons/repositories/write"
import { CompanyWriteRepositoriesImpl } from "@/features/companies/repositories/write"

/**
 * Test de bout en bout : valide -> service -> repository -> Postgres reel,
 * puis relecture. Nettoie les lignes creees (search_results d'abord, a cause
 * des FK vers searches et prospects).
 */
describe("e2e searchResults : creation d'une apparition prospect/recherche", () => {
    const createdSearchIds: string[] = []
    const createdProspectIds: string[] = []
    const createdPersonIds: string[] = []
    const createdCompanyIds: string[] = []
    const createdKeys: { searchId: string; prospectId: string }[] = []

    afterAll(async () => {
        if (createdKeys.length > 0) {
            await SearchResultWriteRepositoriesImpl.deleteMany(createdKeys)
        }
        if (createdProspectIds.length > 0) {
            await ProspectWriteRepositoriesImpl.deleteMultiple(createdProspectIds)
        }
        if (createdPersonIds.length > 0) {
            await PersonWriteRepositoriesImpl.deleteMany(createdPersonIds)
        }
        if (createdCompanyIds.length > 0) {
            await CompanyWriteRepositoriesImpl.deleteMany(createdCompanyIds)
        }
        if (createdSearchIds.length > 0) {
            await Promise.all(createdSearchIds.map((id) => SearchWriteRepositoriesImpl.delete(id)))
        }
    })

    const createSearchAndProspect = async (suffix: string) => {
        const search = await SearchWriteRepositoriesImpl.create({
            name: `Recherche e2e ${suffix}`,
            criteria: { jobTitle: "CEO", industry: "Tech", location: "Paris", headcountMin: 1, headcountMax: 10, revenue: "1M", employeeRange: "1-10" },
            criteriaLabel: `Tech - ${suffix}`,
        })
        createdSearchIds.push(search.id)

        const person = await PersonWriteRepositoriesImpl.create({
            fullName: `Prospect e2e ${suffix}`,
            email: `search-result.e2e+${suffix}@example.com`,
            emailKey: `search-result.e2e+${suffix}@example.com`,
        })
        createdPersonIds.push(person.id)

        const company = await CompanyWriteRepositoriesImpl.create({
            name: `Entreprise e2e ${suffix}`,
            nameKey: `entreprise e2e ${suffix}`,
        })
        createdCompanyIds.push(company.id)

        const prospect = await ProspectWriteRepositoriesImpl.create({ personId: person.id, companyId: company.id })
        createdProspectIds.push(prospect.id)

        return { search, prospect }
    }

    it("cree une apparition et la persiste en base", async () => {
        const { search, prospect } = await createSearchAndProspect(crypto.randomUUID())

        const created = await SearchResultServicesImpl.create({
            searchId: search.id,
            prospectId: prospect.id,
            position: 0,
        })
        createdKeys.push({ searchId: created.searchId, prospectId: created.prospectId })

        expect(created.position).toBe(0)

        const persisted = await SearchResultReadRepositoriesImpl.get({ searchId: search.id, prospectId: prospect.id })
        expect(persisted.searchId).toBe(search.id)
        expect(persisted.prospectId).toBe(prospect.id)
    })

    it("rejette une creation sans searchId ni prospectId sans toucher la base", async () => {
        await expect(SearchResultServicesImpl.create({} as never)).rejects.toBeTruthy()
    })
})
