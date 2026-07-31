import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import { isDevMode } from "@/lib/utils";





const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: isDevMode,

});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };