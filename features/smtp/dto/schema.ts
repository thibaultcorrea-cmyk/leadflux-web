import { ENV } from "@/core/env";
import z from "zod";


export const sendEmailSchema = z.object({
    from: z.string().optional().default(ENV.SMTP_FROM),
    to: z.string().email("to est invalide"),
    subject: z.string().min(1, "sujet est requis"),
    text: z.string().optional(),
    html: z.string().optional(),
})

export type SendEmailDto = z.infer<typeof sendEmailSchema>

