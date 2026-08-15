import z from "zod";
import { Prospect } from "../types/prospect";

export const prospectSchema = z.object({
    id: z.string(),
    company: z.string(),
    contactName: z.string(),
    contactRole: z.string(),
    industry: z.string(),
    city: z.string(),
    headcountLabel: z.string(),
    headcountMin: z.number(),
    headcountMax: z.number(),
});
