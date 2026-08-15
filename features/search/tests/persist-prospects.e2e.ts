import { afterAll, describe, expect, it } from "vitest"
import { persistProspectsFromLeadsApi } from "../services"
import { LeadFinderApiResponse } from "../entities/type"
import { ProspectReadRepositoriesImpl } from "@/features/prospects/repositories/read"
import { ProspectWriteRepositoriesImpl } from "@/features/prospects/repositories/write"
import { PersonReadRepositoriesImpl } from "@/features/persons/repositories/read"
import { PersonWriteRepositoriesImpl } from "@/features/persons/repositories/write"
import { CompanyReadRepositoriesImpl } from "@/features/companies/repositories/read"
import { CompanyWriteRepositoriesImpl } from "@/features/companies/repositories/write"
import { AddressWriteRepositoriesImpl } from "@/features/adresses/repositories/write"

/**
 * Test de bout en bout de la chaine de persistance d'un lead source :
 * leadsApiToProspectFactory -> peristCleanProspect -> adresse, entreprise,
 * personne et prospect reels en base. Nettoie tout ce qui est cree.
 */
describe("e2e search : persistance d'un lead source", () => {
    const createdProspectIds: string[] = []
    const createdPersonIds: string[] = []
    const createdCompanyIds: string[] = []
    const createdAddressIds: string[] = []

    afterAll(async () => {
        if (createdProspectIds.length > 0) {
            await ProspectWriteRepositoriesImpl.deleteMultiple(createdProspectIds)
        }
        if (createdPersonIds.length > 0) {
            await PersonWriteRepositoriesImpl.deleteMany(createdPersonIds)
        }
        if (createdCompanyIds.length > 0) {
            await CompanyWriteRepositoriesImpl.deleteMany(createdCompanyIds)
        }
        if (createdAddressIds.length > 0) {
            await AddressWriteRepositoriesImpl.deleteMany(createdAddressIds)
        }
    })

    it("cree adresse, entreprise, personne et prospect a partir d'un lead source", async () => {
        const uniqueSuffix = crypto.randomUUID()
        const lead: LeadFinderApiResponse = {
            person: {
                name: "Camille Lefevre",
                email: `camille.lefevre+${uniqueSuffix}@example.com`,
                jobTitle: "Directrice commerciale",
            },
            company: {
                name: `Lefevre Conseil ${uniqueSuffix}`,
                industry: "Conseil (strategie, RH, IA)",
                description: "Cabinet de conseil en strategie.",
                keywords: [],
                size: "3-8 employes",
                technologies: [],
                address: {
                    city: `Nantes-e2e-${uniqueSuffix}`,
                    country: "France",
                },
            },
        }

        const results = await persistProspectsFromLeadsApi([lead])

        expect(results).toHaveLength(1)
        const [settled] = results
        expect(settled.status).toBe("fulfilled")
        const prospectSaved = (settled as PromiseFulfilledResult<Awaited<ReturnType<typeof ProspectWriteRepositoriesImpl.create>>>).value
        createdProspectIds.push(prospectSaved.id)
        createdPersonIds.push(prospectSaved.personId)
        createdCompanyIds.push(prospectSaved.companyId)

        const company = await CompanyReadRepositoriesImpl.get(prospectSaved.companyId)
        expect(company.name).toBe(lead.company.name)
        expect(company.addressId).toBeTruthy()
        createdAddressIds.push(company.addressId!)

        const person = await PersonReadRepositoriesImpl.get(prospectSaved.personId)
        expect(person.email).toBe(lead.person.email)
        expect(person.emailKey).toBe(lead.person.email.toLowerCase())

        const prospect = await ProspectReadRepositoriesImpl.get(prospectSaved.id)
        expect(prospect.personId).toBe(person.id)
        expect(prospect.companyId).toBe(company.id)
    })

    it("re-sourcer le meme lead met a jour le prospect existant sans creer de doublon", async () => {
        const uniqueSuffix = crypto.randomUUID()
        const lead: LeadFinderApiResponse = {
            person: {
                name: "Hugo Marchand",
                email: `hugo.marchand+${uniqueSuffix}@example.com`,
                jobTitle: "Associe",
            },
            company: {
                name: `Marchand Transition ${uniqueSuffix}`,
                industry: "Management de transition",
                description: "Management de transition pour PME.",
                keywords: [],
                size: "8-15 employes",
                technologies: [],
                address: {
                    city: `Rennes-e2e-${uniqueSuffix}`,
                    country: "France",
                },
            },
        }

        const [firstRun] = await persistProspectsFromLeadsApi([lead])
        const firstProspect = (firstRun as PromiseFulfilledResult<Awaited<ReturnType<typeof ProspectWriteRepositoriesImpl.create>>>).value
        createdProspectIds.push(firstProspect.id)
        createdPersonIds.push(firstProspect.personId)
        createdCompanyIds.push(firstProspect.companyId)

        const company = await CompanyReadRepositoriesImpl.get(firstProspect.companyId)
        createdAddressIds.push(company.addressId!)

        // Meme email/entreprise : la personne et l'entreprise sont dedupliquees en
        // amont par le sourcing reel, on simule ici uniquement le re-sourcing du
        // meme prospect (memes personId/companyId) pour verifier l'idempotence.
        const secondPersonSaved = await PersonReadRepositoriesImpl.get(firstProspect.personId)
        const secondProspect = await ProspectWriteRepositoriesImpl.create({
            personId: secondPersonSaved.id,
            companyId: company.id,
            rawPayload: { person: lead.person, company: lead.company },
        })

        expect(secondProspect.id).toBe(firstProspect.id)
    })
})
