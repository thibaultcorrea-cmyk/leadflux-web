import { beforeEach, describe, expect, it, vi } from "vitest"

const createMock = vi.fn()
const updateMock = vi.fn()
const getCurrentUserMock = vi.fn()

vi.mock("../repositories/write", () => ({
    EmailWriteRepositoriesImpl: {
        create: (...args: unknown[]) => createMock(...args),
        update: (...args: unknown[]) => updateMock(...args),
    },
}))

vi.mock("../../users/services", () => ({
    UserServices: {
        getCurrentUser: (...args: unknown[]) => getCurrentUserMock(...args),
    },
}))

import { EmailProspectsServicesImpl } from "../services"

describe("EmailProspectsServicesImpl.create", () => {
    beforeEach(() => {
        createMock.mockReset()
        updateMock.mockReset()
        getCurrentUserMock.mockReset()
    })

    it("transmet les donnees validees au repository", async () => {
        createMock.mockResolvedValue({ id: "email_1", prospectName: "Marion Aubert" })

        await EmailProspectsServicesImpl.create({
            prospectName: "Marion Aubert",
            prospectEmail: "marion.aubert@aubert-strategie.fr",
        })

        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                prospectName: "Marion Aubert",
                prospectEmail: "marion.aubert@aubert-strategie.fr",
            }),
        )
    })

    it("rejette une entree invalide sans appeler le repository", async () => {
        await expect(
            EmailProspectsServicesImpl.create({ prospectEmail: "marion@example.com" } as never),
        ).rejects.toBeTruthy()

        expect(createMock).not.toHaveBeenCalled()
    })
})

describe("EmailProspectsServicesImpl.updateStatus", () => {
    beforeEach(() => {
        createMock.mockReset()
        updateMock.mockReset()
        getCurrentUserMock.mockReset()
    })

    it("horodate sent_at et validated_by en passant au statut sent", async () => {
        getCurrentUserMock.mockResolvedValue({ id: "user_1" })
        updateMock.mockResolvedValue({ id: "email_1", status: "sent" })

        await EmailProspectsServicesImpl.updateStatus({ id: "email_1", status: "sent" })

        expect(getCurrentUserMock).toHaveBeenCalledOnce()
        expect(updateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "email_1",
                status: "sent",
                validatedBy: "user_1",
                sentAt: expect.any(Date),
                lastActivityAt: expect.any(Date),
            }),
        )
    })

    it("horodate replied_at en passant au statut replied, sans resoudre l'utilisateur courant", async () => {
        updateMock.mockResolvedValue({ id: "email_1", status: "replied" })

        await EmailProspectsServicesImpl.updateStatus({ id: "email_1", status: "replied" })

        expect(getCurrentUserMock).not.toHaveBeenCalled()
        expect(updateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "email_1",
                status: "replied",
                repliedAt: expect.any(Date),
            }),
        )
    })

    it("rejette une entree invalide sans appeler le repository", async () => {
        await expect(
            EmailProspectsServicesImpl.updateStatus({ status: "sent" } as never),
        ).rejects.toBeTruthy()

        expect(updateMock).not.toHaveBeenCalled()
    })
})
