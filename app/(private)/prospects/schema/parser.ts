import { ProspectApiItem } from "@/app/api/v1/leads/mocks/prospects-response"
import { prospectSchema } from "./prospect-schema"


export const parseSearchResults = (prospects: ProspectApiItem[]) => {
    return prospects.map((prospect) => {
        return prospectSchema.parse({
            id: prospect.id,
            company: prospect.company.name,
            contactName: prospect.person.fullName,
            contactRole: prospect.person.jobTitle,
            sector: prospect.company.sector.name,
            city: prospect.company.address.city,
            headcountLabel: `${prospect.company.headcountMin}-${prospect.company.headcountMax}`,
            headcountMin: prospect.company.headcountMin,
            headcountMax: prospect.company.headcountMax,
        })
    })
}
