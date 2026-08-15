import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()

vi.mock("../repositories/write", () => ({
    AddressWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
    },
}))

import { AddressServicesImpl } from "../services"

describe("AddressServicesImpl.create", () => {
    beforeEach(() => {
        createMock.mockReset()
    })

    it("normalise cityKey et transmet les donnees validees au repository", async () => {
        createMock.mockResolvedValue({ id: "addr_1", city: "Bordeaux", cityKey: "bordeaux", country: "France" })

        await AddressServicesImpl.create({ city: "Bordeaux", country: "France" })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                city: "Bordeaux",
                country: "France",
                cityKey: "bordeaux",
            }),
        )
    })

    it("nettoie les espaces superflus avant de calculer cityKey", async () => {
        createMock.mockResolvedValue({ id: "addr_2" })

        await AddressServicesImpl.create({ city: "  Bordeaux  ", country: "France" })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({ cityKey: "bordeaux" }),
        )
    })

    it("rejette une entree invalide sans appeler le repository", async () => {
        await expect(
            AddressServicesImpl.create({ country: "France" } as never),
        ).rejects.toBeTruthy()

        expect(createMock).not.toHaveBeenCalled()
    })
})
