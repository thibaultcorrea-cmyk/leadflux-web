import { gql } from "graphql-request";


export const QueryKey = {
  GET_SEARCH_PROSPECTS_RESULTS: "get-search-prospects-results",
} as const;

export const GET_SEARCH_PROSPECTS_QUERY = gql`
    query Prospect {
 searches {
    id
    launchedAt
    resultCount
    criteria {
      industry
      jobTitle
      headcountMin
      headcountMax
      employeeRange
      location
      revenue
    }
    results {
      prospect {
        id
        person {
          fullName
          email
          jobTitle
          linkedinUrl
          phone
        }
        company {
          name
          description
          headcountMin
          headcountMax
          address {
            city
            country
          }
          industry {
            name
          }
        }
        lastSourcedAt
      }
    }
  }

  }
`


export const CREATE_SEARCH_PROSPECTS_MUTATION = gql`
mutation CreateSearchResults($inputs: CreateSearchInputs!) {
  createSearchResults(inputs: $inputs) {
    resultCount
    id
    launchedAt
    
  }
}
`

export const SEND_PROSPECT_EMAIL_MUTATION = gql`
mutation GenerateEmailContent($inputs: CreateEmailContentInputs) {
  generateEmailContent(inputs: $inputs) {
    send
    success
    failed
  }
}
`


export const DELETE_PROSPECTS_MUTATION = gql`
   mutation DeleteProspectSearchResults($ids: [ID!]!) {
  deleteProspectSearchResults(ids: $ids) {
    success
    failed
    message
  }
}
`



export const TRUNCATE_PROSPECTS_MUTATION = gql`
mutation ClearSearchResults {
   clearSearchResults {
    message
    success
  }
}
`