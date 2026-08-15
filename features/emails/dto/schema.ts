import * as z from "zod"
import { EMAIL_STATUSES } from "@/db/schemas"



export const EmailSchema = z.object({
    id: z.string(),
    prospectName: z.string(),
    prospectJob: z.string().nullable(),
    prospectCompany: z.string().nullable(),
    prospectEmail: z.string(),
    prospectLocation: z.string().nullable(),
    prospectingConsent: z.boolean(),
    status: z.enum(EMAIL_STATUSES),
    validatedBy: z.string().nullable(),
    sentAt: z.string().nullable(),
    repliedAt: z.string().nullable(),
    lastActivityAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Email = z.infer<typeof EmailSchema>



/**
 * Pas de statut en entree : mode brouillon systematique (CLAUDE.md §4), toute
 * creation garde le "draft" par defaut de la colonne status.
 */
export const createEmailSchema = z.object({
    prospectName: z.string().min(1, "Le nom du prospect est requis"),
    prospectJob: z.string().optional(),
    prospectCompany: z.string().optional(),
    prospectEmail: z.email("L'email du prospect est invalide"),
    prospectLocation: z.string().optional(),
    prospectingConsent: z.boolean().optional(),
})

export type CreateEmailDto = z.infer<typeof createEmailSchema>


export const updateEmailStatusSchema = z.object({
    id: z.string().min(1, "id est requis"),
    status: z.enum(EMAIL_STATUSES),
})

export type UpdateEmailStatusDto = z.infer<typeof updateEmailStatusSchema>
