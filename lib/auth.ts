import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schemas/authSchema";
import { customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { UserServices } from "@/features/users/services";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    plugins: [
        customSession(async ({ user, session }) => {
            const { isAdmin } = await UserServices.getUserById(user.id);
            return {
                user: { ...user, isAdmin: isAdmin },
                session,
            }
        }),
        // Doit rester le dernier plugin : propage le Set-Cookie de session vers
        // le navigateur quand auth.api.* (ex. signUpEmail) est appelé depuis une
        // Server Action côté serveur (ex. création du premier admin).
        nextCookies(),
    ]
});