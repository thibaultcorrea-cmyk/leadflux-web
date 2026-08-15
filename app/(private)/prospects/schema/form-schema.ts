import { z } from "zod";
import { LeadFinderFormSchemaType } from "../types/forms";

export const leadFinderFormSchema = z.object({
    industry: z.string().min(1, "Le secteur est requis."),
    jobTitle: z.string().min(1, "La fonction est requise."),
    location: z.string().min(1, "Le pays est requis."),
    employeeRange: z.string().min(1, "La taille de l'entreprise est requise."),
    revenue: z.string().min(1, "Le revenu est requis."),
})



export const leadFinderFormDefaultValues = {
    industry: "",
    jobTitle: "",
    location: "",
    employeeRange: "",
    revenue: "",
} satisfies LeadFinderFormSchemaType;