import { COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS, JOB_TITLES_OPTIONS, REVENUE_OPTIONS } from "./select-options";

export const hiddenRowActions = ['ajouter'];

export const prospectsRowDisplayCriteria = (criteria: any) => {



    const jobTitle = JOB_TITLES_OPTIONS[criteria.jobTitle]?.label || "Unknown"
    const industry = INDUSTRY_OPTIONS[criteria.industry]?.label || "Unknown"
    const location = criteria.location || { id: "location", label: criteria.location }
    const headcountMin = criteria.headcountMin || "Unknown"
    const headcountMax = criteria.headcountMax || "Unknown"
    const revenue = REVENUE_OPTIONS[criteria.revenue]?.label || "Unknown"
    const employeeRange = COMPANY_SIZE_OPTIONS[criteria.employeeRange].label || "Unknown"

    return {
        jobTitle,
        industry,
        location,
        headcountMin,
        headcountMax,
        revenue,
        employeeRange
    }

}

export const UNKNOWN_CRITERIA = {
    industry: "Unknown",
    jobTitle: "Unknown",
    location: "Unknown",
    headcountMin: 0,
    headcountMax: 0,
    revenue: "Unknown",
    employeeRange: "Unknown"
}



export const parseForCriteriaBar = (criteria: typeof UNKNOWN_CRITERIA) => {
    const result = []
    for (const [key, value] of Object.entries(criteria)) {
        const finderIndustry = INDUSTRY_OPTIONS.find((option) => option.value === value)
        finderIndustry && result.push({ id: key, label: finderIndustry?.label || "Unknown" })
        const finderJobTitle = JOB_TITLES_OPTIONS.find((option) => option.value === value)
        finderJobTitle && result.push({ id: key, label: finderJobTitle?.label || "Unknown" })
        const finderCompanySize = COMPANY_SIZE_OPTIONS.find((option) => option.value === value)
        finderCompanySize && result.push({ id: key, label: finderCompanySize?.label || "Unknown" })
        const finderRevenue = REVENUE_OPTIONS.find((option) => option.value === value)
        finderRevenue && result.push({ id: key, label: finderRevenue?.label || "Unknown" })
        if (key === "location") {
            result.push({ id: key, label: value })
        }

    }

    return result as { id: string, label: string }[]



}