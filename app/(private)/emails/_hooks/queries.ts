import { gql } from "graphql-request";


export const QueryKey = {
  GET_EMAIL_PROSPECTS: "get-email-prospects",
} as const;

export const GET_EMAIL_PROSPECTS_QUERY = gql`
  query EmailsProspects {
  emailsProspects {
    id
    status
    contactName
    company
    contactRole
    recipient
    versions {
      generatedAt
      subject
      body
      id
      knowledgeVersion
    }
    lastActivityLabel
    lastActivityAt
    city
  }
}

`


export const CREATE_EMAIL_PROSPECTS_MUTATION = gql`
mutation CreateManyEmailProspects($input: CreateEmailContentInputs!) {
  createManyEmailProspects(input: $input) {
    success
    send
    failed
  }
}
`

export const UPDATE_EMAIL_STATUS_MUTATION = gql`
mutation UpdateEmailProspectStatus($input: UpdateEmailStatusDto!) {
  updateEmailProspectStatus(input: $input) {
    id
    status
  }
}
`

export const UPDATE_EMAIL_CONTENT_MUTATION = gql`
mutation UpdateEmailContent($input: EmailUpdateContentInput) {
  updateEmailContent(input: $input)
}
`


export const REGENERATE_EMAIL_MUTATION = gql`
mutation RegenerateEmailContent($id: ID!) {
  regenerateEmailContent(id: $id) {
    id
    knowledgeVersion
    subject
    body
    generatedAt
  }
}
`


export const SEND_EMAIL_MUTATION = gql`
mutation ValidateAndSendEmail($id: ID!) {
  validateAndSendEmail(id: $id) {
    threadId
    result
  }
}
`

