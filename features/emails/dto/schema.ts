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
    threadId: z.string().nullable(),
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


/**
 * threadId obligatoire pour passer a "sent" : c'est la preuve d'envoi
 * retournee par le webhook n8n (id du thread Gmail). Sans lui, "sent" ne
 * serait qu'une affirmation sans tracabilite.
 */
export const updateEmailStatusSchema = z.object({
    id: z.string().min(1, "id est requis"),
    status: z.enum(EMAIL_STATUSES),
    threadId: z.string().optional(),
}).refine(
    (data) => data.status !== "sent" || Boolean(data.threadId),
    {
        message: "threadId est requis pour marquer un email comme envoye (retour du webhook n8n)",
        path: ["threadId"],
    },
)

export type UpdateEmailStatusDto = z.infer<typeof updateEmailStatusSchema>



export const updateEmailContentSchema = z.object({
    emailId: z.string().min(1, "email id est requis"),
    subject: z.string().min(1, "sujet est requis"),
    body: z.string().min(1, "corps est requis"),
    recipient: z.string().email("email est invalide"),
    versionId: z.string().min(1, "version id est requis"),
})

export type UpdateEmailContentDto = z.infer<typeof updateEmailContentSchema>


export const createEmailByProspectIdSchema = z.object({
    prospectId: z.string().min(1, "prospect id est requis"),
    prospectingConsent: z.boolean().optional().default(true),
    prospectJob: z.string().min(1, "job est requis"),
    prospectCompany: z.string().optional(),
    prospectName: z.string().optional(),
    prospectLocation: z.string().min(1, "location est requis"),

})

export type CreateEmailByProspectIdDto = z.infer<typeof createEmailByProspectIdSchema>