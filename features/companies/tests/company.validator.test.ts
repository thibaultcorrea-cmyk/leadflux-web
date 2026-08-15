import { describe, expect, it } from "vitest"
import { companyValidator } from "../dto/validator"

describe("companyValidator.validate", () => {
    it("accepte une entreprise valide avec uniquement le nom", () => {
        const result = companyValidator.validate({
            name: "Aubert Strategie",
        })

        expect(result.success).toBe(true)
    })

    it("accepte une entreprise valide avec tous les champs", () => {
        const result = companyValidator.validate({
            name: "Aubert Strategie",
            city: "Dijon",
            website: "https://aubert-strategie.fr",
            description: "Cabinet de conseil en strategie.",
            industryRaw: "Conseil (strategie, RH, IA)",
            sizeRaw: "3-8 employes",
            headcountMin: 3,
            headcountMax: 8,
            addressId: "11111111-1111-1111-1111-111111111111",
        })

        expect(result.success).toBe(true)
    })

    it("rejette une entreprise sans nom", () => {
        const result = companyValidator.validate({
            city: "Dijon",
        })

        expect(result.success).toBe(false)
    })

    it("rejette un nom vide", () => {
        const result = companyValidator.validate({
            name: "",
        })

        expect(result.success).toBe(false)
    })
})
