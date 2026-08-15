import { DateFilter } from "@/types/shared";
import { IStatsReadRepository } from "../../entities/repository";
import { kpis } from "../../mocks/kpis";
import { recentActivity } from "../../mocks/recent-activity";
import { funnelSteps } from "../../mocks/funnel";
import { savedSearches } from "../../mocks/saved-searches";


export const StatsReadRepository: IStatsReadRepository = {
    getKpis: async (filters?: DateFilter) => {
        return kpis;
    },
    getRecentlyActivity: async (filters?: DateFilter) => {
        return recentActivity;
    },
    getLastSearchResults: async (filters?: DateFilter) => {
        return savedSearches;
    },
    getEmailSendChart: async (filters?: DateFilter) => {
        return funnelSteps;
    },
};

