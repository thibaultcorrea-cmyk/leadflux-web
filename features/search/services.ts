import { dateNowIsoString } from "@/lib/date-format"
import { CreateSearchProspectsDto } from "./dto/schema"
import leadFinder from "./mocks/leads-finder-1785665650250.json"
import { searchProspectsValidator } from "./dto/validator"
import { UserServices } from "../users/services"
import { SearchWriteRepositoriesImpl } from "./repositories/write"
import { LeadFinderMock } from "./mocks/lead-finder"
import { LeadFinderApiResponse } from "./entities/type"
import { AddressSqlInfer, CompanySqlInfer, ProspectSourcePayload, ProspectSqlInfer } from "@/db/schemas"



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

        const search_id = search.id
        // Now start search on leads sources and return result on real time 
        const leadsResults = await LeadFinderMock()







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
        id: crypto.randomUUID(),
        fullName: person.name,
        email: person.email,
        emailKey: person.email,
        jobTitle: person.jobTitle,
        phone: null,
        linkedin_url: null,

    }

    const addressData = {
        id: crypto.randomUUID(),
        city: company.address.city,
        cityKey: company.address.city.toLowerCase(),
        country: company.address.country,
        state: company.address.state,
        street: null,
        zip: null,
    } as AddressSqlInfer



    const companyData = {
        id: crypto.randomUUID(),
        name: company.name,
        nameKey: company.name.trim().toLowerCase(),
        cityKey: company.address.city.trim().toLowerCase(),
        description: company.description,
        website: null,
        industryRaw: company.industry,
        industryId: null,
        sizeRaw: company.size,
        headcountMin: 0,
        headcountMax: 0,
        addressId: addressData.id,
    } satisfies Omit<CompanySqlInfer, 'createdAt' | 'updatedAt'>

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


    const mappedData = leadApiResults.map((lead) => leadsApiToProspectFactory(lead))
    const results = await Promise.allSettled(mappedData.map((item) => peristCleanProspect(item)));




}




export const peristCleanProspect = async (data: Awaited<ReturnType<typeof leadsApiToProspectFactory>>) => {


    const { person, company, address, rawPayload } = data

    // First we need to save address 

    const addressSaved = await AddressWriteRepository.create(address)

    // Then company
    const companySaved = await CompanyWriteRepository.create({ ...company, addressId: addressSaved.id })

    // Then person
    const personSaved = await PersonWriteRepository.create({ ...person, companyId: companySaved.id })


    // Then prospect
    const prospectSaved = await ProspectWriteRepository.create({ personId: personSaved.id, companyId: companySaved.id, addressId: addressSaved.id, rawPayload })




}

