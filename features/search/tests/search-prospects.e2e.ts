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
import { user } from "@/db/schemas"
import { SearchWriteRepositoriesImpl } from "../repositories/write"
import { ProspectWriteRepositoriesImpl } from "@/features/prospects/repositories/write"
import { PersonWriteRepositoriesImpl } from "@/features/persons/repositories/write"
import { CompanyWriteRepositoriesImpl } from "@/features/companies/repositories/write"
import { CompanyReadRepositoriesImpl } from "@/features/companies/repositories/read"
import { AddressWriteRepositoriesImpl } from "@/features/adresses/repositories/write"

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
        leadFinderMock.mockResolvedValue([
            {
                person: {
                    name: "Camille Lefevre",
                    email: `camille.lefevre+${uniqueSuffix}@example.com`,
                    jobTitle: "Directrice commerciale",
                },
                company: {
                    name: `Lefevre Conseil ${uniqueSuffix}`,
                    industry: "Conseil (strategie, RH, IA)",
                    description: "Cabinet de conseil en strategie.",
                    keywords: [],
                    size: "3-8 employes",
                    technologies: [],
                    address: { city: `Nantes-e2e-${uniqueSuffix}`, country: "France" },
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
        createdSearchIds.push(result.search.id)

        expect(result.search.resultCount).toBe(1)
        expect(result.prospects).toHaveLength(1)

        const [prospect] = result.prospects
        createdProspectIds.push(prospect.id)
        createdPersonIds.push(prospect.personId)
        createdCompanyIds.push(prospect.companyId)

        const company = await CompanyReadRepositoriesImpl.get(prospect.companyId)
        expect(company.name).toBe(`Lefevre Conseil ${uniqueSuffix}`)
        createdAddressIds.push(company.addressId!)
    })

    it("rejette des criteres invalides sans creer de recherche ni interroger la source", async () => {
        await expect(
            SearchProspectsServicesImpl.searchProspects({ jobTitle: "" } as never),
        ).rejects.toBeTruthy()

        expect(leadFinderMock).not.toHaveBeenCalled()
    })
})
