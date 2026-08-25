
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
    id: ID!
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

enum EmailProspectStatus {
    draft
    sent
    replied
}

type EmailVersion {
    id: ID!
    subject: String!
    body: String!
    generatedAt: String!
    knowledgeVersion: String!
}

type EmailProspect {
    id: ID!
    contactName: String
    contactRole: String
    company: String
    city: String
    recipient: String
    status: EmailProspectStatus
    lastActivityAt: String
    lastActivityLabel: String
    versions: [EmailVersion!]!
}

type Query {
    searches: [ProspectSearch!]
    emailsProspects: [EmailProspect!]
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


type SearchResultsCreated {
    id: String!
    launchedAt: String!
    resultCount: Int!
}

type SearchResultsCleared {
    success: Boolean!
    message: String!
}

input ProspectInput {
    prospectName: String
    prospectEmail: String!
    prospectJob: String
    prospectCompany: String
    prospectLocation: String
    prospectingConsent: Boolean!
}

input ProspectEmailInput{
    prospectId: ID!
    prospectName: String
    prospectCompany: String
    prospectJob: String!
    prospectLocation: String
    prospectingConsent: Boolean!
    
}

input CreateEmailContentInputs {
    prospects: [ProspectEmailInput!]!
}

input RegenerateEmailContentInputs {
    ids: [ID!]!
}

type EmailProspectCreated {
    success: Boolean!
    send: Int
    failed: Int

}

type ActionManyResult{
    message: String!
    success: Int
    failed: Int
}

type GeneratedEmailContent {
    id: String!
    subject: String!
    body: String!
    knowledgeVersion: String!
    generatedAt: String!
    

}

type RegenerateEmailContentOutput {
    success: Boolean!
    send: Int
    failed: Int
    data: [GeneratedEmailContent!]


}

input EmailUpdateContentInput {
     emailId: ID!
    subject: String!
    body: String!
    recipient: String!
    versionId: ID!
}

type ValidateSendEmailOutput {
    success: Boolean
    threadId: String!
    result: String
}

type Mutation {
    createSearchResults(inputs: CreateSearchInputs): SearchResultsCreated
    clearSearchResults: SearchResultsCleared
    generateEmailContent(inputs: CreateEmailContentInputs): EmailProspectCreated
    regenerateEmailContent(id: ID!): GeneratedEmailContent
    updateEmailContent(input: EmailUpdateContentInput): String
    validateAndSendEmail(id: ID!): ValidateSendEmailOutput
    deleteManyEmailProspects(ids: [ID!]!): SearchResultsCleared
    
   
}

`





const typeDefs = queryDefs + mutationDefs

export default typeDefs