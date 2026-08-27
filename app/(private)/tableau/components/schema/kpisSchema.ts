import { LucideIcon } from "lucide-react";
import z from "zod";


const kpiIdSchemaEnum = z.enum(["drafted", "sent", "replied", "totalProspects", "repliedRate"])

export const kpiSchema = z.object({
    id: kpiIdSchemaEnum,
    label: z.string(),
    value: z.coerce.number(),
    hint: z.string().optional(),
    icon: z.custom<LucideIcon>(),
});

export const kpisSchema = z.array(kpiSchema);




