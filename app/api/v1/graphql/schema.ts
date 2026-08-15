
const queryDefs = `#graphql


enum KpiType {
    number
    percentage
    text
    action
}

type KpiItem {
   id: String
   label: String!
   value: Int!
   hint: String!
   type: KpiType!
}

type RecentlyActivityItem {
     id: String!
    prospect: String!
    company: String!
    status: String!
    timestamp: String!
}


type SavedSearchItem {
    id: String!
    name: String!
    criteria: String!
    count: Int!
}


type FunnelStepItem {
    id: String!
    label: String!
    value: Int!
}


interface Step {
    id: ID!
    title: String!
    description: String!
}

type Adress {
    id: ID!
    city: String!
    country: String
    zip: String!
  
  
}

type Company {
    id: ID!
    name: String!
    website: String!
    address: Adress
    industry: String!
    size: String!
    description: String!
    keywords: [String!]!
    createdAt: String!
    updatedAt: String!
}
    

type Prospect {
    id: ID!
    name: String!
    email: String!
    jobTitle: String!
    company: Company
    createdAt: String!
    updatedAt: String!
}

type Person {
  id: ID!
    name: String!
    email: String!
    jobTitle: String!
    company: Company
    createdAt: String!
    updatedAt: String!
    
}




type ProspectAddress {
    city: String!
    country: String!
}

type ProspectIndustry {
    name: String!
}

type ProspectPerson {
    fullName: String!
    email: String!
    jobTitle: String!
    linkedinUrl: String!
    phone: String!
}

type ProspectCompany {
    name: String!
    description: String!
    headcountMin: Int!
    headcountMax: Int!
    industry: ProspectIndustry!
    address: ProspectAddress!
}

type LeadProspect {
    person: ProspectPerson!
    company: ProspectCompany!
    lastSourcedAt: String!
}

type SearchResult {
    prospect: LeadProspect!
}

type ProspectSearch {
    id: ID!
    launchedAt: String!
    resultCount: Int!
    results: [SearchResult!]!
}

type Query {
    searches: [ProspectSearch!]
    prospect(id: ID!): Prospect
    kpis: [KpiItem!]!
    recentlyActivity: [RecentlyActivityItem!]!
    lastSearchResults: [SavedSearchItem!]!
    emailSendChart: [FunnelStepItem!]!
    
    
}
    
`

const mutationDefs = `#graphql

input CreateSearchInputs {
    industry: String!
    jobTitle: String!
    location: String!
    headcountMin: Int
    headcountMax: Int
    revenue: String!
    employeeRange: String!

}

type Mutation {
    createSearchResults(inputs: CreateSearchInputs): [ProspectSearch!]
}

`





const typeDefs = queryDefs + mutationDefs

export default typeDefs