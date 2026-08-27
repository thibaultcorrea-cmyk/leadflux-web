

export type KpiType = "number" | "percentage" | "text" | "action";

export type KpiItem = {
    id: string;
    label: string;
    value: number;
    hint?: string;
    type: KpiType;

}



export type RecentlyActivityItem = {
    id: string;
    prospect: string;
    company: string;
    status: string;
    timestamp: string;
}


export type SavedSearchItem = {
    id: string;
    name: string;
    criteria: string;
    count: number;
}


export type FunnelStepItem = {
    id: string;
    label: string;
    value: number;
}


export type CriterItem = {
    revenue: string,
    industry: string,
    jobTitle: string,
    location: string,
    headcountMax: number,
    headcountMin: number,
    employeeRange: string
}


export type LastSearchResultItem = {
    id: string,
    launchedAt: Date,
    criteria: CriterItem,
    count: number

}

