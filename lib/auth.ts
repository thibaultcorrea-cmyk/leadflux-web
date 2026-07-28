import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    plugins: [
        customSession(async ({ user, session }) => {
            return {
                user: { ...user, role: "admin" },
                session,
            }
        })
    ]
});