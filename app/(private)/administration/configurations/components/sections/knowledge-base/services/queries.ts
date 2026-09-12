import { gql } from "graphql-request";



export const KNOWLEDGE_BASE_QUERIES_KEYS = {
    GET_LAST_KNOWLEDGE_BASE: "GET_LAST_KNOWLEDGE_BASE",
}


export const GET_LAST_KNOWLEDGE_BASE = gql`
query LastKnowledgeVersion {
  lastKnowledgeVersion {
    id
    name
    countWords
    totalIndexed
    file {
      originalName
      path
      size
      extension
    }
    indexedBy {
      name
      image
    }
    createdAt
  }
  
}

`

