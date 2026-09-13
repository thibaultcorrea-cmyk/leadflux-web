import { gql } from "graphql-request";

export const SETTINGS_QUERIES_KEYS = {
    GET_CURRENT_LOGO: "GET_CURRENT_LOGO",

} as const;



export const GET_CURRENT_LOGO_QUERY = gql`
    query CurrentLogo {
        currentLogo {
            name
            key
            url
            size
            height
            width
            createdAt
        }
    }
`;
