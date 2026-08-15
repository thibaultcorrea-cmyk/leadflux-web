import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()

vi.mock("../repositories/write", () => ({
    SearchResultWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
    },
}))

import { SearchResultServicesImpl } from "../services"

describe("SearchResultServicesImpl.create", () => {
    beforeEach(() => {
        createMock.mockReset()
    })

    it("transmet les donnees validees au repository", async () => {
        createMock.mockResolvedValue({ searchId: "search_1", prospectId: "prospect_1", position: 0 })

        await SearchResultServicesImpl.create({ searchId: "search_1", prospectId: "prospect_1", position: 0 })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({ searchId: "search_1", prospectId: "prospect_1", position: 0 }),
        )
    })

    it("rejette une entree invalide sans appeler le repository", async () => {
        await expect(
            SearchResultServicesImpl.create({ prospectId: "prospect_1" } as never),
        ).rejects.toBeTruthy()

        expect(createMock).not.toHaveBeenCalled()
    })
})
