import { describe, expect, it } from "vitest"
import { emailVersionValidator } from "../dto/validator"

const REQUIRED_FIELDS = {
    emailId: "email_1",
    subject: "Un mot sur votre prospection",
    body: ["Bonjour Marion,", "Thibault Correa, OxIAgen"],
}

describe("emailVersionValidator.validate", () => {
    it("accepte une version valide avec uniquement les champs requis", () => {
        const result = emailVersionValidator.validate(REQUIRED_FIELDS)

        expect(result.success).toBe(true)
    })

    it("accepte une version valide avec tous les champs", () => {
        const result = emailVersionValidator.validate({
            ...REQUIRED_FIELDS,
            knowledgeVersion: "12/07/2026",
        })

        expect(result.success).toBe(true)
    })

    it("rejette une version sans emailId", () => {
        const { emailId, ...rest } = REQUIRED_FIELDS
        const result = emailVersionValidator.validate(rest)

        expect(result.success).toBe(false)
    })

    it("rejette une version sans objet", () => {
        const { subject, ...rest } = REQUIRED_FIELDS
        const result = emailVersionValidator.validate(rest)

        expect(result.success).toBe(false)
    })

    it("rejette une version avec un corps vide", () => {
        const result = emailVersionValidator.validate({ ...REQUIRED_FIELDS, body: [] })

        expect(result.success).toBe(false)
    })
})
