import { z } from "zod";
import { LeadFinderFormSchemaType } from "../types/forms";

export const leadFinderFormSchema = z.object({
    industry: z.string().min(1, "Le secteur est requis."),
    jobTitles: z.array(z.string()).min(1, "La fonction est requise."),
    country: z.string().min(1, "Le pays est requis."),
    companyRange: z.string().min(1, "La taille de l'entreprise est requise."),
    revenue: z.string().min(1, "Le revenu est requis."),
})



export const leadFinderFormDefaultValues = {
    industry: "",
    jobTitles: [],
    country: "",
    companyRange: "",
    revenue: "",
} satisfies LeadFinderFormSchemaType;