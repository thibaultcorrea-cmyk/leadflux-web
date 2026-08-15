import { describe, expect, it } from "vitest"
import { addressValidator } from "../dto/validator"

describe("addressValidator.validate", () => {
    it("accepte une adresse valide avec uniquement ville et pays", () => {
        const result = addressValidator.validate({
            city: "Bordeaux",
            country: "France",
        })

        expect(result.success).toBe(true)
    })

    it("accepte une adresse valide avec tous les champs", () => {
        const result = addressValidator.validate({
            city: "Bordeaux",
            country: "France",
            street: "12 rue des Merlettes",
            zip: "33000",
            state: "Nouvelle-Aquitaine",
        })

        expect(result.success).toBe(true)
    })

    it("rejette une adresse sans ville", () => {
        const result = addressValidator.validate({
            country: "France",
        })

        expect(result.success).toBe(false)
    })

    it("rejette une adresse sans pays", () => {
        const result = addressValidator.validate({
            city: "Bordeaux",
        })

        expect(result.success).toBe(false)
    })

    it("rejette une ville vide", () => {
        const result = addressValidator.validate({
            city: "",
            country: "France",
        })

        expect(result.success).toBe(false)
    })
})
