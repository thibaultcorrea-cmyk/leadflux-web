import { afterAll, beforeEach, describe, expect, it, vi } from "vitest"

const getCurrentUserMock = vi.fn()
const leadFinderMock = vi.fn()

vi.mock("../../users/services", () => ({
    UserServices: {
        getCurrentUser: (...args: unknown[]) => getCurrentUserMock(...args),
    },
}))

/**
 * LeadFinderMock est deja un bouchon de source externe non branchee (cf. sa
 * fixture statique de 100 leads a emails fixes, incompatible avec un test
 * rejouable). On lui fournit ici un lead unique par run ; tout le reste
 * (recherche, adresse, entreprise, personne, prospect) touche la vraie base.
 */
vi.mock("../mocks/lead-finder", () => ({
    LeadFinderMock: (...args: unknown[]) => leadFinderMock(...args),
}))

import { SearchProspectsServicesImpl } from "../services"
import { db } from "@/db"
import { user, persons, companies, prospects } from "@/db/schemas"
import { and, eq } from "drizzle-orm"
import { SearchWriteRepositoriesImpl } from "../repositories/write"
import { ProspectWriteRepositoriesImpl } from "@/features/prospects/repositories/write"
import { PersonWriteRepositoriesImpl } from "@/features/persons/repositories/write"
import { CompanyWriteRepositoriesImpl } from "@/features/companies/repositories/write"
import { AddressWriteRepositoriesImpl } from "@/features/adresses/repositories/write"
import { SearchResultReadRepositoriesImpl } from "@/features/searchResults/repositories/read"

describe("e2e search : searchProspects", () => {
    const createdSearchIds: string[] = []
    const createdProspectIds: string[] = []
    const createdPersonIds: string[] = []
    const createdCompanyIds: string[] = []
    const createdAddressIds: string[] = []

    beforeEach(async () => {
        const [adminUser] = await db.select().from(user).limit(1)
        getCurrentUserMock.mockReset().mockResolvedValue(adminUser)
        leadFinderMock.mockReset()
    })

    afterAll(async () => {
        if (createdProspectIds.length > 0) {
            await ProspectWriteRepositoriesImpl.deleteMultiple(createdProspectIds)
        }
        if (createdPersonIds.length > 0) {
            await PersonWriteRepositoriesImpl.deleteMany(createdPersonIds)
        }
        if (createdCompanyIds.length > 0) {
            await CompanyWriteRepositoriesImpl.deleteMany(createdCompanyIds)
        }
        if (createdAddressIds.length > 0) {
            await AddressWriteRepositoriesImpl.deleteMany(createdAddressIds)
        }
        if (createdSearchIds.length > 0) {
            await Promise.all(createdSearchIds.map((id) => SearchWriteRepositoriesImpl.delete(id)))
        }
    })

    it("cree une recherche et persiste les prospects renvoyes par la source", async () => {
        const uniqueSuffix = crypto.randomUUID()
        const email = `camille.lefevre+${uniqueSuffix}@example.com`
        const companyName = `Lefevre Conseil ${uniqueSuffix}`
        const city = `Nantes-e2e-${uniqueSuffix}`

        leadFinderMock.mockResolvedValue([
            {
                person: { name: "Camille Lefevre", email, jobTitle: "Directrice commerciale" },
                company: {
                    name: companyName,
                    industry: "Conseil (strategie, RH, IA)",
                    description: "Cabinet de conseil en strategie.",
                    keywords: [],
                    size: "3-8 employes",
                    technologies: [],
                    address: { city, country: "France" },
                },
            },
        ])

        const result = await SearchProspectsServicesImpl.searchProspects({
            jobTitle: "Directeur commercial",
            industry: "Conseil",
            location: "Nantes",
            employeeRange: "3-8",
            revenue: "1M-5M",
        })

        // Mutation.createSearchResults renvoie [ProspectSearch!], et le contrat
        // GraphQL n'expose pas les ids internes (person/company/prospect) : on
        // les retrouve via leurs cles metier pour le nettoyage et la
        // verification de search_results.
        expect(result).toHaveLength(1)
        const [prospectSearch] = result
        createdSearchIds.push(prospectSearch.id)

        expect(prospectSearch.resultCount).toBe(1)
        expect(prospectSearch.results).toHaveLength(1)

        const [{ prospect }] = prospectSearch.results
        expect(prospect.person.fullName).toBe("Camille Lefevre")
        expect(prospect.person.email).toBe(email)
        expect(prospect.company.name).toBe(companyName)
        expect(prospect.company.address.city).toBe(city)

        const [personRow] = await db.select().from(persons).where(eq(persons.emailKey, email.toLowerCase()))
        expect(personRow).toBeTruthy()
        createdPersonIds.push(personRow.id)

        const [companyRow] = await db.select().from(companies).where(eq(companies.nameKey, companyName.trim().toLowerCase()))
        expect(companyRow).toBeTruthy()
        createdCompanyIds.push(companyRow.id)
        if (companyRow.addressId) {
            createdAddressIds.push(companyRow.addressId)
        }

        const [prospectRow] = await db.select().from(prospects).where(
            and(eq(prospects.personId, personRow.id), eq(prospects.companyId, companyRow.id)),
        )
        expect(prospectRow).toBeTruthy()
        createdProspectIds.push(prospectRow.id)

        // search_results est cascade-supprime par la suppression du prospect ou
        // de la recherche (FK on delete cascade des deux cotes), pas de cleanup
        // dedie ici.
        const searchResult = await SearchResultReadRepositoriesImpl.get({ searchId: prospectSearch.id, prospectId: prospectRow.id })
        expect(searchResult.position).toBe(0)
    })

    it("rejette des criteres invalides sans creer de recherche ni interroger la source", async () => {
        await expect(
            SearchProspectsServicesImpl.searchProspects({ jobTitle: "" } as never),
        ).rejects.toBeTruthy()

        expect(leadFinderMock).not.toHaveBeenCalled()
    })
})
