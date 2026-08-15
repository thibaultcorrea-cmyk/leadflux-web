import { ApolloServer } from "@apollo/server";
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { buildSchema } from 'drizzle-graphql';
import { isDevMode } from "@/lib/utils";
import * as schemas from "@/db/schemas";
import { db } from "@/db";





// Apollo Sandbox embarqué : accessible en GET sur /api/graphql/v1 en dev uniquement.
// En production, page d'accueil neutre sans explorateur ni introspection.
const landingPagePlugin = isDevMode
    ? ApolloServerPluginLandingPageLocalDefault({ embed: true })
    : ApolloServerPluginLandingPageProductionDefault({ embed: false });


const { schema } = buildSchema(db)




const server = new ApolloServer({
    schema,
    introspection: isDevMode,
    plugins: [landingPagePlugin],
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };