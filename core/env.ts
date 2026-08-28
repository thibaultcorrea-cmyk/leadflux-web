import z from "zod";

const envSchema = z.object({
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    DATABASE_URL: z.string().default("postgresql://leadflux:leadflux@localhost:5432/leadflux"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
    ADMIN_EMAIL: z.string().email().default("[EMAIL_ADDRESS]"),
    ADMIN_PASSWORD: z.string().min(1).default("passw@rd2026"),
    ADMIN_NAME: z.string().default("Admin"),
    ADMIN_IMAGE_URL: z.url().default(""),
    N8N_WEBHOOK_URL: z.url().default("http://localhost:5678"),
    SMTP_USER: z.string().default("assadi.halifa@gmail.com"),
    SMTP_PASS: z.string().default(""),
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_FROM: z.string().default("assadi.halifa@gmail.com"),
    SMTP_FROM_ALIAS: z.string().default("LeadFlux"),

});

export const ENV = envSchema.parse(process.env);
