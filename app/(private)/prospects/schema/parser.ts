import { ProspectApiItem } from "@/app/api/v1/leads/mocks/prospects-response"
import { prospectSchema } from "./prospect-schema"


export const parseSearchResults = (prospects: { prospect: ProspectApiItem }[]) => {



    return prospects.map(({ prospect }) => {

        const address = prospect.company.address || { city: "Inconnue", country: "Inconnue" }
        const industry = prospect.company.industry.name || "Inconnue"
        const city = address.city || "Inconnue"
        const country = address.country || "Inconnue"




        return prospectSchema.parse({
            id: prospect.id,
            company: prospect.company.name,
            contactName: prospect.person.fullName,
            contactRole: prospect.person.jobTitle,
            industry: industry,
            city: city,
            country: country,
            headcountLabel: `${prospect.company.headcountMin}-${prospect.company.headcountMax}`,
            headcountMin: prospect.company.headcountMin,
            headcountMax: prospect.company.headcountMax,
            prospectedAt: prospect.prospectedAt,
        })
    })
}
