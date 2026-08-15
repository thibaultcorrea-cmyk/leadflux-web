import { describe, expect, it } from "vitest"
import { personValidator } from "../dto/validator"

describe("personValidator.validate", () => {
    it("accepte une personne valide avec uniquement nom complet et email", () => {
        const result = personValidator.validate({
            fullName: "Marion Aubert",
            email: "marion.aubert@example.com",
        })

        expect(result.success).toBe(true)
    })

    it("accepte une personne valide avec tous les champs", () => {
        const result = personValidator.validate({
            fullName: "Marion Aubert",
            email: "marion.aubert@example.com",
            jobTitle: "Directrice associee",
            phone: "+33600000000",
            linkedinUrl: "https://www.linkedin.com/in/marion-aubert",
        })

        expect(result.success).toBe(true)
    })

    it("rejette une personne sans nom complet", () => {
        const result = personValidator.validate({
            email: "marion.aubert@example.com",
        })

        expect(result.success).toBe(false)
    })

    it("rejette un email invalide", () => {
        const result = personValidator.validate({
            fullName: "Marion Aubert",
            email: "pas-un-email",
        })

        expect(result.success).toBe(false)
    })
})
