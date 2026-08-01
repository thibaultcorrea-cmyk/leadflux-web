import { gql } from "graphql-request";


export const QueryKey = {
  GET_KPIS: "get-kpis",
  GET_RECENTLY_ACTIVITY: "get-recently-activity",
  GET_SAVED_SEARCH: "get-saved-search",
  GET_FUNNEL_STEP: "get-funnel-step",
} as const;

export const GET_KPIS_QUERY = gql`
    query RetrieveKpis {
    kpis {
      id
      label
      value
      hint
    }
  }
`

export const GET_SAVED_SEARCH_QUERY = gql`
    query LastSavedSearch{
    lastSearchResults {
      id
      name
      criteria
      count
    }
  }
`

export const GET_RECENTLY_ACTIVITY_QUERY = gql`
    query RecentlyActivity{
    recentlyActivity {
      id
      action
      timestamp
      user
    }
  }
`

