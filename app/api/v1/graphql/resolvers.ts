import { EmailProspectsServicesImpl } from "@/features/emails/services";
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
        emailsProspects: () => EmailProspectsServicesImpl.collections({}),
    },
    Mutation: {
        createSearchResults: (_: any, args: any) => SearchProspectsServicesImpl.searchProspects(args.inputs),
        clearSearchResults: async (): Promise<{ success: boolean, message: string }> => {
            const result = await SearchProspectsServicesImpl.cleanAll()
            const message = result ? "Search results cleared successfully" : "Failed to clear search results"
            return { success: result, message }
        },
        generateEmailContent: (_: any, args: any) => EmailProspectsServicesImpl.generateMany(args.inputs.prospects),
        updateEmailContent: async (_: any, args: any) => {
            await EmailProspectsServicesImpl.updateEmailContent(args.input)
            return "Email content updated successfully"
        },


        regenerateEmailContent: async (_: any, args: any) => EmailProspectsServicesImpl.regenerate(args.id),
        validateAndSendEmail: async (_: any, args: any) => EmailProspectsServicesImpl.send(args.id),
        deleteManyEmailProspects: async (_: any, args: any) => EmailProspectsServicesImpl.deleteMany(args.ids),
        /* deleteEmailProspect: async (_: any, args: any) => EmailProspectsServicesImpl.delete(args.input),
       / clearEmailProspects: async (_: any, args: any) => EmailProspectsServicesImpl.clear(),*/
    },

};


export default resolvers