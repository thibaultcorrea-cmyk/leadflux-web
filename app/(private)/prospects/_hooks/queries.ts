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
    results {
      prospect {
        person {
          fullName
          email
          jobTitle
          linkedinUrl
          phone
        }
        company {
          address {
            city
            country
          }
          description
          headcountMax
          headcountMin
          name
          sector {
            name
          }
        }
        lastSourcedAt
      }
    }
  }

  }
`
