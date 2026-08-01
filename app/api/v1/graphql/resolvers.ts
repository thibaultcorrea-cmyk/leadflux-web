import { KpisServices } from "@/features/stats/kpis/services";

const resolvers = {
    Query: {
        kpis: () => KpisServices.getKpis(),
        recentlyActivity: () => KpisServices.getRecentlyActivity(),
        lastSearchResults: () => KpisServices.getLastSearchResults(),
        emailSendChart: () => KpisServices.getEmailSendChart(),
        prospects: () => [],
    },

};


export default resolvers