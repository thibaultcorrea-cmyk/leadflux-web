
const typeDefs = `#graphql

type FunnelStepItem {
   id: String!
   label: String!
   value: Int!
   tone: String!
   
}



type Step {
    id: ID!
    title: String!
    description: String!
}

interface Adress {
    id: ID!
    city: String!
    country: String
    zip: String!
  
  
}

interface Company {
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
    

interface Prospect {
    id: ID!
    name: String!
    email: String!
    jobTitle: String!
    company: Company
    createdAt: String!
    updatedAt: String!
}

type Query {
    prospects: [Prospect!]
    prospect(id: ID!): Prospect
    funnelSteps: [FunnelStepItem!]!
    
}
    
`

export default typeDefs