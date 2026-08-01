import { ApolloServer } from "@apollo/server";
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import { isDevMode } from "@/lib/utils";

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

export { handler as GET, handler as POST };