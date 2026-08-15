import { dateNowIsoString } from "@/lib/date-format"
import { CreateSearchProspectsDto } from "./dto/schema"
import leadFinder from "./mocks/leads-finder-1785665650250.json"
import { SearchProspectsWriteRepositoriesImpl } from "./repositories/write"
import { searchProspectsValidator } from "./dto/validator"
import { UserServices } from "../users/services"



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
        const search = await SearchProspectsWriteRepositoriesImpl.create({
            name,
            criteria: { ...criteriaData, headcountMax, headcountMin },
            createdBy: currentUser.id,
            criteriaLabel,
        })

        return search.id

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


