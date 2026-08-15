import { beforeEach, describe, expect, it, vi } from "vitest"

const getCurrentUserMock = vi.fn()
const searchCreateMock = vi.fn()
const searchUpdateMock = vi.fn()
const leadFinderMock = vi.fn()
const addressCreateMock = vi.fn()
const companyCreateMock = vi.fn()
const personCreateMock = vi.fn()
const prospectCreateMock = vi.fn()
const searchResultCreateMock = vi.fn()

vi.mock("../../users/services", () => ({
    UserServices: {
        getCurrentUser: (...args: unknown[]) => getCurrentUserMock(...args),
    },
}))

vi.mock("../repositories/write", () => ({
    SearchWriteRepositoriesImpl: {
        create: (...args: unknown[]) => searchCreateMock(...args),
        update: (...args: unknown[]) => searchUpdateMock(...args),
    },
}))

vi.mock("../mocks/lead-finder", () => ({
    LeadFinderMock: (...args: unknown[]) => leadFinderMock(...args),
}))

vi.mock("@/features/adresses/services", () => ({
    AddressServicesImpl: { create: (...args: unknown[]) => addressCreateMock(...args) },
}))
vi.mock("@/features/companies/services", () => ({
    CompanyServicesImpl: { create: (...args: unknown[]) => companyCreateMock(...args) },
}))
vi.mock("@/features/persons/services", () => ({
    PersonServicesImpl: { create: (...args: unknown[]) => personCreateMock(...args) },
}))
vi.mock("@/features/prospects/services", () => ({
    ProspectServicesImpl: { create: (...args: unknown[]) => prospectCreateMock(...args) },
}))
vi.mock("@/features/searchResults/services", () => ({
    SearchResultServicesImpl: { create: (...args: unknown[]) => searchResultCreateMock(...args) },
}))

import { SearchProspectsServicesImpl } from "../services"

const validCriteria = {
    jobTitle: "CEO",
    industry: "Technology",
    location: "Paris",
    employeeRange: "3-8",
    revenue: "1M-5M",
}

const leadFixture = (label: string) => ({
    person: { name: `Person ${label}`, email: `${label}@example.com`, jobTitle: "CEO" },
    company: {
        name: `Company ${label}`,
        industry: "Technology",
        description: "desc",
        keywords: [],
        size: "3-8",
        technologies: [],
        address: { city: "Paris", country: "France" },
    },
})

describe("SearchProspectsServicesImpl.searchProspects", () => {
    beforeEach(() => {
        getCurrentUserMock.mockReset().mockResolvedValue({ id: "user_1" })
        searchCreateMock.mockReset().mockResolvedValue({ id: "search_1" })
        searchUpdateMock.mockReset().mockImplementation((data: { id: string; resultCount: number }) =>
            Promise.resolve({ id: data.id, resultCount: data.resultCount }),
        )
        leadFinderMock.mockReset()
        addressCreateMock.mockReset().mockResolvedValue({ id: "address_1" })
        companyCreateMock.mockReset().mockImplementation((input: { addressId?: string }) =>
            Promise.resolve({ id: "company_1", addressId: input.addressId }),
        )
        personCreateMock.mockReset().mockResolvedValue({ id: "person_1" })
        prospectCreateMock.mockReset().mockImplementation((input: Record<string, unknown>) =>
            Promise.resolve({ id: `prospect_${prospectCreateMock.mock.calls.length}`, ...input }),
        )
        searchResultCreateMock.mockReset().mockResolvedValue({})
    })

    it("cree la recherche avec les criteres normalises", async () => {
        leadFinderMock.mockResolvedValue([])

        await SearchProspectsServicesImpl.searchProspects(validCriteria)

        expect(searchCreateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                criteriaLabel: expect.stringContaining("CEO - Technology"),
                criteria: expect.objectContaining({ headcountMin: 3, headcountMax: 8 }),
                createdBy: "user_1",
            }),
        )
    })

    it("persiste chaque lead retourne par la source et reflete le compteur de resultats", async () => {
        leadFinderMock.mockResolvedValue([leadFixture("a"), leadFixture("b")])

        const result = await SearchProspectsServicesImpl.searchProspects(validCriteria)

        expect(addressCreateMock).toHaveBeenCalledTimes(2)
        expect(companyCreateMock).toHaveBeenCalledTimes(2)
        expect(personCreateMock).toHaveBeenCalledTimes(2)
        expect(prospectCreateMock).toHaveBeenCalledTimes(2)
        expect(result.prospects).toHaveLength(2)
        expect(searchResultCreateMock).toHaveBeenCalledTimes(2)
        expect(searchResultCreateMock).toHaveBeenCalledWith(
            expect.objectContaining({ searchId: "search_1", prospectId: "prospect_1", position: 0 }),
        )
        expect(searchResultCreateMock).toHaveBeenCalledWith(
            expect.objectContaining({ searchId: "search_1", prospectId: "prospect_2", position: 1 }),
        )
        expect(searchUpdateMock).toHaveBeenCalledWith(
            expect.objectContaining({ id: "search_1", resultCount: 2 }),
        )
        expect(result.search).toEqual({ id: "search_1", resultCount: 2 })
    })

    it("rejette des criteres invalides sans creer de recherche ni interroger la source", async () => {
        await expect(
            SearchProspectsServicesImpl.searchProspects({ jobTitle: "" } as never),
        ).rejects.toBeTruthy()

        expect(searchCreateMock).not.toHaveBeenCalled()
        expect(leadFinderMock).not.toHaveBeenCalled()
    })
})
