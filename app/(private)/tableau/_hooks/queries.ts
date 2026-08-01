import { gql } from "graphql-request";


export const QueryKey = {
    GET_KPIS: "get-kpis",
    GET_RECENTLY_ACTIVITY: "get-recently-activity",
    GET_SAVED_SEARCH: "get-saved-search",
    GET_FUNNEL_STEP: "get-funnel-step",
} as const;

export const GET_KPIS_QUERY = gql`
    query GetKpis {
    kpis {
      id
      label
      value
      hint
    }
  }
`