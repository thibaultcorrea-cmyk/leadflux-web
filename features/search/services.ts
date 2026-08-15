import { dateNowIsoString } from "@/lib/date-format"
import { CreateSearchProspectsDto } from "./dto/schema"
import leadFinder from "./mocks/leads-finder-1785665650250.json"
import { searchProspectsValidator } from "./dto/validator"
import { UserServices } from "../users/services"
import { SearchWriteRepositoriesImpl } from "./repositories/write"
import { LeadFinderMock } from "./mocks/lead-finder"
import { LeadFinderApiResponse } from "./entities/type"
import { ProspectSourcePayload } from "@/db/schemas"
import { AddressServicesImpl } from "@/features/adresses/services"
import { CreateAddressDto } from "@/features/adresses/dto/schema"
import { CompanyServicesImpl } from "@/features/companies/services"
import { CreateCompanyDto } from "@/features/companies/dto/schema"
import { PersonServicesImpl } from "@/features/persons/services"
import { CreatePersonDto } from "@/features/persons/dto/schema"
import { ProspectServicesImpl } from "@/features/prospects/services"
import { SearchResultServicesImpl } from "@/features/searchResults/services"



export const SearchProspectsServicesImpl: any = {
    searchProspects: async (criteriaInputs: CreateSearchProspectsDto) => {

        const currentUser = await UserServices.getCurrentUser()

        const dateStr = dateNowIsoString()
        const criteriaValidated = searchProspectsValidator.validate(criteriaInputs)
        if (!criteriaValidated.success) {
            throw criteriaValidated.error
        }

        const { data: criteriaData } = criteriaValidated
        const name = `${criteriaData.jobTitle} - ${criteriaData.industry} - ${criteriaData.location} - ${dateStr}`
        const criteriaLabel = `${criteriaData.jobTitle} - ${criteriaData.industry} - ${dateStr}`

        const { headcountMax, headcountMin } = criteriaEmployeeRangeFactory(criteriaData)
        const search = await SearchWriteRepositoriesImpl.create({
            name,
            criteria: { ...criteriaData, headcountMax, headcountMin },
            createdBy: currentUser.id,
            criteriaLabel,
        })

        // Now start search on leads sources and return result on real time
        const leadsResults = await LeadFinderMock()

        // after getting leads results, we need to save them to the database
        const persistedResults = await persistProspectsFromLeadsApi(leadsResults)
        const fulfilledProspects = persistedResults
            .map((result, position) => ({ result, position }))
            .filter((entry): entry is { result: PromiseFulfilledResult<Awaited<ReturnType<typeof peristCleanProspect>>>; position: number } => entry.result.status === "fulfilled")
            .map(({ result, position }) => ({ prospect: result.value, position }))

        // link each persisted prospect to this search, keeping the source ranking as position
        await Promise.allSettled(
            fulfilledProspects.map(({ prospect, position }) =>
                SearchResultServicesImpl.create({ searchId: search.id, prospectId: prospect.id, position }),
            ),
        )

        const prospects = fulfilledProspects.map(({ prospect }) => prospect)

        // after saving the leads, reflect the real result count on the search
        const updatedSearch = await SearchWriteRepositoriesImpl.update({
            id: search.id,
            resultCount: prospects.length,
        })

        return {
            ...updatedSearch,
            results: { prospects }
        }
    },


}

const criteriaEmployeeRangeFactory = (criteriaData: CreateSearchProspectsDto) => {

    if (criteriaData.employeeRange) {
        const headcountMin = Number(criteriaData.employeeRange.split("-")[0])
        const headcountMax = Number(criteriaData.employeeRange.split("-")[1])
        return { headcountMax, headcountMin }
    }

    return { headcountMax: criteriaData.headcountMax ?? 0, headcountMin: criteriaData.headcountMin ?? 0 }
}



const leadsApiToProspectFactory = async (lead: LeadFinderApiResponse) => {

    const { person, company } = lead

    const persondata = {
        fullName: person.name,
        email: person.email,
        jobTitle: person.jobTitle,
    } satisfies CreatePersonDto

    const addressData = {
        city: company.address.city,
        country: company.address.country,
        state: company.address.state,
    } satisfies CreateAddressDto



    const companyData = {
        name: company.name,
        city: company.address.city,
        description: company.description,
        industryRaw: company.industry,
        sizeRaw: company.size,
        headcountMin: 0,
        headcountMax: 0,
    } satisfies Omit<CreateCompanyDto, "addressId">

    const rawPayload = {
        person,
        company
    } satisfies ProspectSourcePayload


    return {
        person: persondata,
        company: companyData,
        address: addressData,
        rawPayload,
    }


}

export const persistProspectsFromLeadsApi = async (leadApiResults: LeadFinderApiResponse[]) => {

    const mappedData = await Promise.all(leadApiResults.map((lead) => leadsApiToProspectFactory(lead)))
    const results = await Promise.allSettled(mappedData.map((item) => peristCleanProspect(item)))

    return results
}




export const peristCleanProspect = async (data: Awaited<ReturnType<typeof leadsApiToProspectFactory>>) => {


    const { person, company, address, rawPayload } = data

    // First we need to save address

    const addressSaved = await AddressServicesImpl.create(address)

    // Then company
    const companySaved = await CompanyServicesImpl.create({ ...company, addressId: addressSaved.id })

    // Then person
    const personSaved = await PersonServicesImpl.create(person)

    // Then prospect
    const prospectSaved = await ProspectServicesImpl.create({ personId: personSaved.id, companyId: companySaved.id, rawPayload })

    return prospectSaved
}

