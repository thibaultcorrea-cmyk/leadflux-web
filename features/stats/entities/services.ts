import { DateFilter } from "@/types/shared";

export interface IStatsServices {
    getKpis(filters?: DateFilter): Promise<any[]>;
    getRecentlyActivity(filters?: DateFilter): Promise<any[]>;
    getLastSearchResults(filters?: DateFilter): Promise<any[]>;
    getEmailSendChart(filters?: DateFilter): Promise<any[]>;
}

