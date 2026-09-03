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
        deleteProspectSearchResults: async (_: any, args: any) => ProspectServicesImpl.deleteMany(args.ids),
        clearSearchResults: async (): Promise<{ success: boolean, message: string }> => {
            const result = await SearchProspectsServicesImpl.clear()
            const message = result ? "Search results cleared successfully" : "Failed to clear search results"
            return { success: result, message }
        },
        clearEmailProspects: async (): Promise<{ success: boolean, message: string }> => {
            try {
                await EmailProspectsServicesImpl.clear()
                return { success: true, message: "Email prospects cleared successfully" }
            } catch (error) {
                return { success: false, message: "Failed to clear email prospects" }
            }
        },
        generateEmailContent: (_: any, args: any) => EmailProspectsServicesImpl.generateMany(args.inputs.prospects),
        updateEmailContent: async (_: any, args: any) => {
            await EmailProspectsServicesImpl.updateEmailContent(args.input)
            return "Email content updated successfully"
        },


        regenerateEmailContent: async (_: any, args: any) => EmailProspectsServicesImpl.regenerate(args.id),
        validateAndSendEmail: async (_: any, args: any) => EmailProspectsServicesImpl.send(args.id),
        validateAndSendEmailsMany: async (_: any, args: any) => EmailProspectsServicesImpl.sendMany(args.ids),
        deleteManyEmailProspects: async (_: any, args: any) => EmailProspectsServicesImpl.deleteMany(args.ids),
    },

};


export default resolvers