import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()

vi.mock("../repositories/write", () => ({
    PersonWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
    },
}))

import { PersonServicesImpl } from "../services"

describe("PersonServicesImpl.create", () => {
    beforeEach(() => {
        createMock.mockReset()
    })

    it("normalise emailKey en minuscules et transmet les donnees validees au repository", async () => {
        createMock.mockResolvedValue({ id: "person_1", fullName: "Marion Aubert", email: "Marion.Aubert@Example.com" })

        await PersonServicesImpl.create({ fullName: "Marion Aubert", email: "Marion.Aubert@Example.com" })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                fullName: "Marion Aubert",
                email: "Marion.Aubert@Example.com",
                emailKey: "marion.aubert@example.com",
            }),
        )
    })

    it("rejette une entree invalide sans appeler le repository", async () => {
        await expect(
            PersonServicesImpl.create({ email: "marion@example.com" } as never),
        ).rejects.toBeTruthy()

        expect(createMock).not.toHaveBeenCalled()
    })
})
