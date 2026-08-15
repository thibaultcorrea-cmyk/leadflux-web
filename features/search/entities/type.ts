
export type LeadFinderApiResponse = {

    person: {
        name: string,
        email: string,
        jobTitle: string,

    },
    company: {
        name: string,
        industry: string,
        description: string,
        keywords: string[],
        size: string,
        technologies: string[],
        address: {
            city: string,
            state?: string,
            country: string
        },
        financials?: {
            annualRevenue: string,
            annualRevenueClean: string,
        }
    }
}