import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()
const deleteMock = vi.fn()
const deleteMultipleMock = vi.fn()
const truncateMock = vi.fn()

vi.mock("../repositories/write", () => ({
    ProspectWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
        delete: (...args: unknown[]) => deleteMock(...args),
        deleteMultiple: (...args: unknown[]) => deleteMultipleMock(...args),
        truncate: (...args: unknown[]) => truncateMock(...args),
    },
}))

import { ProspectServicesImpl } from "../services"

describe("ProspectServicesImpl", () => {
    beforeEach(() => {
        createMock.mockReset()
        deleteMock.mockReset()
        deleteMultipleMock.mockReset()
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

    describe("deleteMultiple", () => {
        it("delegue au repository de write", async () => {
            deleteMultipleMock.mockResolvedValue(undefined)

            await ProspectServicesImpl.deleteMultiple(["prospect_1", "prospect_2"])

            expect(deleteMultipleMock).toHaveBeenCalledWith(["prospect_1", "prospect_2"])
        })
    })

    describe("truncate", () => {
        it("delegue au repository de write", async () => {
            truncateMock.mockResolvedValue(undefined)

            await ProspectServicesImpl.truncate()

            expect(truncateMock).toHaveBeenCalled()
        })
    })
})
