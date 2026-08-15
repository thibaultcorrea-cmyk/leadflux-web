import { LucideIcon } from "lucide-react";
import z from "zod";



export const kpiSchema = z.object({
    id: z.string(),
    label: z.string(),
    value: z.coerce.number(),
    hint: z.string(),
    icon: z.custom<LucideIcon>(),
});

export const kpisSchema = z.array(kpiSchema);




