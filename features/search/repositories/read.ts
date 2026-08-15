import { db } from "@/db";
import { ISearchReadRepository } from "../entities/repository";
import { addresses, companies, industries, persons, prospects, searches, searchResults, user } from "@/db/schemas";
import { eq, sql } from "drizzle-orm";

export const SearchReadRepositoriesImpl: ISearchReadRepository = {
    get: async (id: string) => {
        throw new Error("Method not implemented.");
    },
    find: async (query: any) => {
        const queryBuilder = db.select({
            id: searches.id,
            name: searches.name,
            criteria: searches.criteria,
            resultCount: searches.resultCount,
            results: sql`SELECT jsonb_agg(${searchResults}) FROM ${searchResults} WHERE ${searchResults.searchId} = ${searches.id}`,



        }).from(searches)
            .leftJoin(user, eq(searches.createdBy, user.id))
            .leftJoin(searchResults, eq(searches.id, searchResults.searchId))
            .leftJoin(persons, eq(searchResults.prospectId, persons.id))
            .leftJoin(prospects, eq(persons.id, prospects.id))
            .leftJoin(companies, eq(prospects.id, companies.id))
            .leftJoin(addresses, eq(companies.addressId, addresses.id))
            .leftJoin(industries, eq(companies.industryId, industries.id))

        return queryBuilder.execute()
    },
    count: async (query: any) => {
        throw new Error("Method not implemented.");
    },




}