import { ApolloServer } from "@apollo/server";
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import { isDevMode } from "@/lib/utils";
import type { NextRequest } from "next/server";







// Apollo Sandbox embarqué : accessible en GET sur /api/graphql/v1 en dev uniquement.
// En production, page d'accueil neutre sans explorateur ni introspection.
const landingPagePlugin = isDevMode
    ? ApolloServerPluginLandingPageLocalDefault({ embed: true })
    : ApolloServerPluginLandingPageProductionDefault({ embed: false });





const server = new ApolloServer({

    typeDefs,
    resolvers,
    introspection: isDevMode,
    plugins: [landingPagePlugin],
});

const handler = startServerAndCreateNextHandler(server);

// Wrappe explicitement pour une signature App Router unique : le type de
// `handler` (overload Pages Router + App Router de @as-integrations/next)
// ne satisfait pas tel quel le RouteHandlerConfig genere par `next build`.
export function GET(request: NextRequest) {
    return handler(request);
}

export function POST(request: NextRequest) {
    return handler(request);
}