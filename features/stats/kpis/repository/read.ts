import { DateFilter } from "@/types/shared";
import { IStatsReadRepository } from "../../entities/repository";
import { kpis } from "../../mocks/kpis";
import { funnelSteps } from "../../mocks/funnel";
import { db } from "@/db";
import { emails, searches } from "@/db/schemas";
import { desc, eq, sql } from "drizzle-orm";
import { CriterItem, LastSearchResultItem, RecentlyActivityItem } from "../../entities/type";


export const StatsReadRepository: IStatsReadRepository = {
    getKpis: async (filters?: DateFilter) => {

        return kpis;
    },
    getRecentlyActivity: async (filters?: DateFilter) => {

        const query = db.select({
            id: emails.id,
            prospect: emails.prospectName,
            company: emails.prospectCompany,
            status: emails.status,
            timestamp: emails.updatedAt,
        }).from(emails).orderBy(desc(emails.updatedAt)).limit(10)
        const result = await query
        const recentActivity = result.map((item) => recentActivityFactory(item))
        return recentActivity;
    },
    getLastSearchResults: async (filters?: DateFilter) => {
        const query = db.select({
            id: searches.id,
            launchedAt: searches.launchedAt,
            criteria: searches.criteria,
            count: searches.resultCount,

        }).from(searches).orderBy(desc(searches.launchedAt)).limit(10)
        const result = await query
        const savedSearches = result.map((item) => lastSearchResultsFactory(item))
        return savedSearches;
    },
    getEmailSendChart: async (filters?: DateFilter) => {
        return funnelSteps;
    },
};


export const lastSearchResultsFactory = (item: LastSearchResultItem) => {
    return {
        id: item.id,
        name: item.criteria.industry,
        criteria: criteriaNameFactory(item.criteria),
        count: Number(item.count),
        launchedAt: item.launchedAt,

    }
}

export const recentActivityFactory = (item: any): RecentlyActivityItem => {
    return {
        id: item.id,
        prospect: item.prospect,
        company: item.company,
        status: item.status,
        timestamp: item.timestamp,

    }
}

export const criteriaNameFactory = (criteria: CriterItem): string => {
    const range = `${criteria.headcountMin}-${criteria.headcountMax} sal.`
    return `${criteria.jobTitle} - ${range} - ${criteria.location}`
}
