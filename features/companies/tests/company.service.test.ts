import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()

vi.mock("../repositories/write", () => ({
    CompanyWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
    },
}))

import { CompanyServicesImpl } from "../services"

describe("CompanyServicesImpl.create", () => {
    beforeEach(() => {
        createMock.mockReset()
    })

    it("calcule nameKey et cityKey et transmet les donnees validees au repository", async () => {
        createMock.mockResolvedValue({ id: "company_1", name: "Aubert Strategie" })

        await CompanyServicesImpl.create({ name: "Aubert Strategie", city: "Dijon" })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Aubert Strategie",
                nameKey: "aubert strategie",
                cityKey: "dijon",
            }),
        )
    })

    it("laisse cityKey indefini quand aucune ville n'est fournie", async () => {
        createMock.mockResolvedValue({ id: "company_2" })

        await CompanyServicesImpl.create({ name: "Aubert Strategie" })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({ nameKey: "aubert strategie", cityKey: undefined }),
        )
    })

    it("rejette une entree invalide sans appeler le repository", async () => {
        await expect(
            CompanyServicesImpl.create({} as never),
        ).rejects.toBeTruthy()

        expect(createMock).not.toHaveBeenCalled()
    })
})
