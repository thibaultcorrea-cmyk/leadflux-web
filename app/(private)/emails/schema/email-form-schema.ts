import { EmailVersion } from "../types/email";
import z from "zod";

export const emailFormSchema = z.object({
    subject: z.string().min(1, "Le sujet est requis"),
    body: z.string().min(1, "Le contenu est requis"),
    recipient: z.string().email("Veuillez entrer un email valide"),
})

export type EmailFormValues = z.infer<typeof emailFormSchema>