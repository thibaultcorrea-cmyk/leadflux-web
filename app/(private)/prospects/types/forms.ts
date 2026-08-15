import { z } from "zod";
import { leadFinderFormSchema } from "../schema/form-schema";

export type LeadFinderFormSchemaType = z.infer<typeof leadFinderFormSchema>


export type SELECT_OPTIONS_TYPE = {
    label: string,
    value: string,
    id?: string
}