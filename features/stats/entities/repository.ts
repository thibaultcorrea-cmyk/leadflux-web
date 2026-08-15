import { DateFilter } from "@/types/shared";

export interface IStatsReadRepository {
    /**
     * Get The tops values of the most important metrics
     * Like: Leads, Verified Leads,Bounce Rate, Average Credit Score, etc
     * @param filters 
     * @returns 
     */
    getKpis(filters?: DateFilter): Promise<any[]>;

    /**
     * Get the recently activity of the users
     * Like: New Leads, Verified Leads, Bounce Rate, Average Credit Score, etc
     * @param filters 
     * @returns 
     */
    getRecentlyActivity(filters?: DateFilter): Promise<any[]>;

    /**
     * Get the last search results
     * Like: New Leads, Verified Leads, Bounce Rate, Average Credit Score, etc
     * @param filters 
     * @returns 
     */
    getLastSearchResults(filters?: DateFilter): Promise<any[]>;

    /**
     * Get the email send chart
     * Obtain Email send and email responded values
     * @param filters 
     * @returns 
     */
    getEmailSendChart(filters?: DateFilter): Promise<any[]>;



}

