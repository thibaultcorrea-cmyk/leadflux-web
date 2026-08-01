import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schemas/authSchema";
import { customSession } from "better-auth/plugins";
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
        })
    ]
});