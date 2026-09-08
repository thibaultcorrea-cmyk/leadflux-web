import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()
const deleteMock = vi.fn()
const deleteManyMock = vi.fn()
const truncateMock = vi.fn()

vi.mock("../repositories/write", () => ({
    ProspectWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
        delete: (...args: unknown[]) => deleteMock(...args),
        deleteMany: (...args: unknown[]) => deleteManyMock(...args),
        truncate: (...args: unknown[]) => truncateMock(...args),
    },
}))

import { ProspectServicesImpl } from "../services"

describe("ProspectServicesImpl", () => {
    beforeEach(() => {
        createMock.mockReset()
        deleteMock.mockReset()
        deleteManyMock.mockReset()
        truncateMock.mockReset()
    })

    describe("create", () => {
        it("transmet les donnees validees au repository", async () => {
            createMock.mockResolvedValue({ id: "prospect_1", personId: "person_1", companyId: "company_1" })

            await ProspectServicesImpl.create({ personId: "person_1", companyId: "company_1" })

            expect(createMock).toHaveBeenCalledWith(
                expect.objectContaining({ personId: "person_1", companyId: "company_1" }),
            )
        })

        it("rejette une entree invalide sans appeler le repository", async () => {
            await expect(
                ProspectServicesImpl.create({ companyId: "company_1" } as never),
            ).rejects.toBeTruthy()

            expect(createMock).not.toHaveBeenCalled()
        })
    })

    describe("delete", () => {
        it("delegue au repository de write", async () => {
            deleteMock.mockResolvedValue(undefined)

            await ProspectServicesImpl.delete("prospect_1")

            expect(deleteMock).toHaveBeenCalledWith("prospect_1")
        })
    })

    describe("deleteMany", () => {
        it("supprime chaque id individuellement et rapporte le compte de succes", async () => {
            deleteMock.mockResolvedValue(undefined)

            const result = await ProspectServicesImpl.deleteMany(["prospect_1", "prospect_2"])

            expect(deleteMock).toHaveBeenCalledWith("prospect_1")
            expect(deleteMock).toHaveBeenCalledWith("prospect_2")
            expect(deleteMock).toHaveBeenCalledTimes(2)
            expect(result).toEqual({ success: 2, failed: 0, message: "prospects deleted successfully" })
        })

        it("comptabilise a part les ids dont la suppression echoue", async () => {
            deleteMock.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("not found"))

            const result = await ProspectServicesImpl.deleteMany(["prospect_1", "prospect_2"])

            expect(result).toEqual({ success: 1, failed: 1, message: "prospects deleted successfully" })
        })
    })

    describe("clear", () => {
        it("delegue au repository de write (truncate)", async () => {
            truncateMock.mockResolvedValue(undefined)

            await ProspectServicesImpl.clear()

            expect(truncateMock).toHaveBeenCalled()
        })
    })
})
