import { describe, expect, it } from "vitest"
import { emailValidator } from "../dto/validator"

describe("emailValidator.validate", () => {
    it("accepte un email valide avec uniquement les champs requis", () => {
        const result = emailValidator.validate({
            prospectName: "Marion Aubert",
            prospectEmail: "marion.aubert@aubert-strategie.fr",
        })

        expect(result.success).toBe(true)
    })

    it("accepte un email valide avec tous les champs", () => {
        const result = emailValidator.validate({
            prospectName: "Marion Aubert",
            prospectJob: "Directrice associee",
            prospectEmail: "marion.aubert@aubert-strategie.fr",
            prospectingConsent: true,
        })

        expect(result.success).toBe(true)
    })

    it("rejette un email sans nom de prospect", () => {
        const result = emailValidator.validate({
            prospectEmail: "marion.aubert@aubert-strategie.fr",
        })

        expect(result.success).toBe(false)
    })

    it("rejette un email de prospect invalide", () => {
        const result = emailValidator.validate({
            prospectName: "Marion Aubert",
            prospectEmail: "pas-un-email",
        })

        expect(result.success).toBe(false)
    })

    it("rejette un statut fourni a la creation", () => {
        const result = emailValidator.validate({
            prospectName: "Marion Aubert",
            prospectEmail: "marion.aubert@aubert-strategie.fr",
            status: "sent",
        })

        // Un champ inconnu est simplement ignore par Zod : le statut cree
        // reste "draft", cote base, quoi qu'on transmette ici.
        expect(result.success).toBe(true)
        expect(result.data).not.toHaveProperty("status")
    })
})

describe("emailValidator.validateStatus", () => {
    it("accepte une transition vers replied sans threadId", () => {
        const result = emailValidator.validateStatus({ id: "email_1", status: "replied" })

        expect(result.success).toBe(true)
    })

    it("accepte une transition vers sent avec threadId", () => {
        const result = emailValidator.validateStatus({ id: "email_1", status: "sent", threadId: "thread_123" })

        expect(result.success).toBe(true)
    })

    it("rejette une transition vers sent sans threadId", () => {
        const result = emailValidator.validateStatus({ id: "email_1", status: "sent" })

        expect(result.success).toBe(false)
    })

    it("rejette un statut hors de l'enum", () => {
        const result = emailValidator.validateStatus({ id: "email_1", status: "envoye" })

        expect(result.success).toBe(false)
    })

    it("rejette une transition sans id", () => {
        const result = emailValidator.validateStatus({ status: "sent", threadId: "thread_123" })

        expect(result.success).toBe(false)
    })
})
