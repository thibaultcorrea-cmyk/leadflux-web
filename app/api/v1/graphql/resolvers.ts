import { ProspectServicesImpl } from "@/features/prospects/services";
import { SearchProspectsServicesImpl } from "@/features/search/services";
import { KpisServices } from "@/features/stats/kpis/services";

const resolvers = {
    Query: {
        kpis: () => KpisServices.getKpis(),
        recentlyActivity: () => KpisServices.getRecentlyActivity(),
        lastSearchResults: () => KpisServices.getLastSearchResults(),
        emailSendChart: () => KpisServices.getEmailSendChart(),
        searches: () => ProspectServicesImpl.collections({}),
        //searches: () => ProspectServicesImpl.search({}),
    },
    Mutation: {
        createSearchResults: (_: any, args: any) => SearchProspectsServicesImpl.searchProspects(args.inputs),
    },

};


export default resolvers