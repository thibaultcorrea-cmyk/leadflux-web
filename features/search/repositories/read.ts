import { db } from "@/db";
import { ISearchReadRepository } from "../entities/repository";
import { prospects, ProspectSourcePayload, searches, searchResults } from "@/db/schemas";
import { asc, desc, eq, inArray, sql } from "drizzle-orm";

/**
 * Reconstruit la forme GraphQL LeadProspect a partir du raw_payload stocke sur
 * le prospect : linkedinUrl/phone/headcountMin/headcountMax n'existent pas
 * encore dans le payload source (cf. features/search/services.ts), vides/0 en
 * attendant qu'une vraie source les fournisse.
 */
const leadProspectFromRow = (row: { id: string; rawPayload: ProspectSourcePayload | null; lastSourcedAt: Date; prospectedAt: Date | null }) => {
    const payload = row.rawPayload
    const headcountMin = parseInt(payload?.company?.size?.split('-')[0] ?? "0", 10) || 0
    const headcountMax = parseInt(payload?.company?.size?.split('-')[1] ?? "0", 10) || 0



    return {
        id: row.id,
        person: {
            fullName: payload?.person.name ?? "",
            email: payload?.person.email ?? "",
            jobTitle: payload?.person.jobTitle ?? "",
            linkedinUrl: "",
            phone: "",
        },
        company: {
            name: payload?.company.name ?? "",
            description: payload?.company.description ?? "",
            headcountMin: headcountMin,
            headcountMax: headcountMax,
            industry: { name: payload?.company.industry ?? "" },
            address: {
                city: payload?.company.address?.city ?? "",
                country: payload?.company.address?.country ?? "",
            },
        },

        lastSourcedAt: row.lastSourcedAt.toISOString(),
        prospectedAt: row.prospectedAt?.toISOString(),
    }
}

export const SearchReadRepositoriesImpl: ISearchReadRepository = {
    get: async (id: string) => {
        throw new Error("Method not implemented.");
    },
    find: async (query: any) => {
        const searchRows = await db.select({
            id: searches.id,
            launchedAt: searches.launchedAt,
            resultCount: searches.resultCount,
            criteria: searches.criteria,
        }).from(searches)
            .orderBy(desc(searches.launchedAt)).limit(1)

        if (searchRows.length === 0) {
            return []
        }

        const resultRows = await db.select({
            id: prospects.id,
            searchId: searchResults.searchId,
            position: searchResults.position,
            rawPayload: prospects.rawPayload,
            lastSourcedAt: prospects.lastSourcedAt,
            prospectedAt: prospects.prospectedAt,
        }).from(searchResults)
            .innerJoin(prospects, eq(searchResults.prospectId, prospects.id))
            .where(inArray(searchResults.searchId, searchRows.map((search) => search.id)))
            .orderBy(asc(searchResults.position))

        const [{ count }] = await db.select({
            count: sql<number>`CAST(count(*) as integer)`,
        }).from(searchResults).where(inArray(searchResults.searchId, searchRows.map((search) => search.id)))



        return searchRows.map((search) => ({
            id: search.id,
            launchedAt: search.launchedAt.toISOString(),
            resultCount: count,
            criteria: search.criteria,
            results: resultRows
                .filter((result) => result.searchId === search.id)
                .map((result) => ({ prospect: leadProspectFromRow(result) })),
        }))
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.");
    },
}