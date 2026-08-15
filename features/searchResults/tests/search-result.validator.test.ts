import { describe, expect, it } from "vitest"
import { searchResultValidator } from "../dto/validator"

describe("searchResultValidator.validate", () => {
    it("accepte une apparition valide", () => {
        const result = searchResultValidator.validate({
            searchId: "11111111-1111-1111-1111-111111111111",
            prospectId: "22222222-2222-2222-2222-222222222222",
            position: 0,
        })

        expect(result.success).toBe(true)
    })

    it("rejette sans searchId", () => {
        const result = searchResultValidator.validate({
            prospectId: "22222222-2222-2222-2222-222222222222",
            position: 0,
        })

        expect(result.success).toBe(false)
    })

    it("rejette sans prospectId", () => {
        const result = searchResultValidator.validate({
            searchId: "11111111-1111-1111-1111-111111111111",
            position: 0,
        })

        expect(result.success).toBe(false)
    })

    it("rejette une position negative", () => {
        const result = searchResultValidator.validate({
            searchId: "11111111-1111-1111-1111-111111111111",
            prospectId: "22222222-2222-2222-2222-222222222222",
            position: -1,
        })

        expect(result.success).toBe(false)
    })
})
