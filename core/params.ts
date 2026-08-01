
export const PAGE_SIZE = 25;
export const DEFAULT_PAGE = 1;
export const DEFAULT_ORDER_DIRECTION = "desc";
export const DEFAULT_ORDER_BY = "createdAt";

export const GRAPHQL_BASE_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/api/v1/graphql";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";