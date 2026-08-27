import { DateFilter } from "@/types/shared";
import { IStatsReadRepository } from "../../entities/repository";
import { kpis } from "../../mocks/kpis";
import { funnelSteps } from "../../mocks/funnel";
import { db } from "@/db";
import { emails, searches } from "@/db/schemas";
import { desc, eq, sql } from "drizzle-orm";
import { CriterItem, KpiItem, LastSearchResultItem, RecentlyActivityItem } from "../../entities/type";
import { kpiEmailStats, KpiEmailStatsSqlInfer } from "@/db/schemas/kpi-stats";


export const StatsReadRepository: IStatsReadRepository = {
    getKpis: async (filters?: DateFilter) => {

        const [kpisData] = await db.select().from(kpiEmailStats)
        return kpiEmailViewToItemFactory(kpisData);
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


export const kpiEmailViewToItemFactory = (kpiEmailView: KpiEmailStatsSqlInfer): KpiItem[] => {
    const result: KpiItem[] = []

    for (const [key, value] of Object.entries(kpiEmailView)) {
        if (key === "totalProspects") {
            result.push({
                id: key,
                label: "Prospects sourcés",
                type: "number",
                value: Number(value) ?? 0,
            })
        }
        else if (key === "drafted") {
            result.push({
                id: key,
                label: "Brouillons à valider",
                type: "number",
                value: Number(value) ?? 0,
            })
        }
        else if (key === "sent") {
            result.push({
                id: key,
                label: "Emails envoyés",
                type: "number",
                value: Number(value) ?? 0,
            })
        }
        else if (key === "replied") {
            result.push({
                id: key,
                label: "Réponses reçues",
                type: "number",
                value: Number(value) ?? 0,
            })
        }
        else if (key === "repliedRate") {
            result.push({
                id: key,
                label: "Taux de réponse",
                type: "number",
                value: Number(value) ?? 0,
            })
        }

    }

    return result
}