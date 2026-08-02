import { z } from "zod";
import { leadFinderFormSchema } from "../schema/form-schema";

export type LeadFinderFormSchemaType = z.infer<typeof leadFinderFormSchema>