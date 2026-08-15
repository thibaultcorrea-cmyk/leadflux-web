
import { LeadFinderApiResponse } from "../entities/type";
import leadsFinderJSON from "./leads-finder-1785665650250.json"





export const LeadFinderMock = async (): Promise<LeadFinderApiResponse[]> => {

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    await delay(5000);

    return leadsFinderJSON as LeadFinderApiResponse[];



}


const searchMockData = {
    id: "search_1",
    name: "Search name",
    criteria: {
        jobTitle: "CEO",
        industry: "Technology",
        headcountMin: 1,
        headcountMax: 10,
        limit: 100
    },
    createdBy: "user_1",
    criteriaLabel: "CEO - Technology - 2024-01-01"
}

const leadMockData = {
    id: "lead_1",
    prospectId: "prospect_1",
    position: 1,
    archivedAt: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z"
}
