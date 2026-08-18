import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()
const findMock = vi.fn()

vi.mock("../repositories/write", () => ({
    EmailVersionWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
    },
}))

vi.mock("../repositories/read", () => ({
    EmailVersionReadRepositoriesImpl: {
        find: (...args: unknown[]) => findMock(...args),
    },
}))

import { EmailVersionServicesImpl } from "../services"

describe("EmailVersionServicesImpl.create", () => {
    beforeEach(() => {
        createMock.mockReset()
        findMock.mockReset()
    })

    it("transmet les donnees validees au repository", async () => {
        createMock.mockResolvedValue({ id: "version_1", emailId: "email_1" })

        await EmailVersionServicesImpl.create({
            emailId: "email_1",
            subject: "Un mot sur votre prospection",
            body: ["Bonjour Marion,", "Thibault Correa, OxIAgen"],
        })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                emailId: "email_1",
                subject: "Un mot sur votre prospection",
            }),
        )
    })

    it("rejette une entree invalide sans appeler le repository", async () => {
        await expect(
            EmailVersionServicesImpl.create({ emailId: "email_1" } as never),
        ).rejects.toBeTruthy()

        expect(createMock).not.toHaveBeenCalled()
    })
})

describe("EmailVersionServicesImpl.collections", () => {
    beforeEach(() => {
        createMock.mockReset()
        findMock.mockReset()
    })

    it("delegue au repository de lecture", async () => {
        findMock.mockResolvedValue([{ id: "version_1" }])

        const result = await EmailVersionServicesImpl.collections({ emailId: "email_1" })

        expect(findMock).toHaveBeenCalledWith({ emailId: "email_1" })
        expect(result).toEqual([{ id: "version_1" }])
    })
})
