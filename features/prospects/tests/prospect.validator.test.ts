import { describe, expect, it } from "vitest"
import { prospectValidator } from "../dto/validator"

describe("prospectValidator.validate", () => {
    it("accepte un prospect valide avec personId et companyId", () => {
        const result = prospectValidator.validate({
            personId: "11111111-1111-1111-1111-111111111111",
            companyId: "22222222-2222-2222-2222-222222222222",
        })

        expect(result.success).toBe(true)
    })

    it("accepte un prospect valide avec un rawPayload", () => {
        const result = prospectValidator.validate({
            personId: "11111111-1111-1111-1111-111111111111",
            companyId: "22222222-2222-2222-2222-222222222222",
            rawPayload: { person: { name: "Marion" }, company: { name: "Aubert" } },
        })

        expect(result.success).toBe(true)
    })

    it("rejette un prospect sans personId", () => {
        const result = prospectValidator.validate({
            companyId: "22222222-2222-2222-2222-222222222222",
        })

        expect(result.success).toBe(false)
    })

    it("rejette un prospect sans companyId", () => {
        const result = prospectValidator.validate({
            personId: "11111111-1111-1111-1111-111111111111",
        })

        expect(result.success).toBe(false)
    })
})
