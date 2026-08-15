import { DateFilter } from "@/types/shared";
import { IStatsServices } from "../entities/services";
import { StatsReadRepository } from "./repository/read";


export const KpisServices: IStatsServices = {
    getKpis: async (filters?: DateFilter) => {
        const data = await StatsReadRepository.getKpis(filters);
        return data;
    },
    getRecentlyActivity: async (filters?: DateFilter) => {
        const data = await StatsReadRepository.getRecentlyActivity(filters);
        return data;
    },
    getLastSearchResults: async (filters?: DateFilter) => {
        const data = await StatsReadRepository.getLastSearchResults(filters);
        return data;
    },
    getEmailSendChart: async (filters?: DateFilter) => {
        const data = await StatsReadRepository.getEmailSendChart(filters);
        return data;
    },
};