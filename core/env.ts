import z from "zod";

const envSchema = z.object({
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    DATABASE_URL: z.string().default("postgresql://leadflux:password@localhost:5432/leadflux"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),

});

export const ENV = envSchema.parse(process.env);
