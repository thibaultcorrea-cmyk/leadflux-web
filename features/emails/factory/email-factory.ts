import { EmailSqlInfer, EmailVersionSqlInfer } from "@/db/schemas";
import { Email, EmailVersion } from "../entities/type";
import { AgentEmailSendInput } from "@/features/agent/email/entities/agentEmail";

/**
 * email_versions ne stocke que knowledgeBaseId (FK) : le libelle affiche
 * (knowledgeVersion, ex. "version-1699999999") vient de knowledge_base.name
 * et doit etre resolu par l'appelant (jointure en repository, ou valeur deja
 * en main lors de la creation) avant d'appeler cette factory.
 */
export type EmailVersionRow = EmailVersionSqlInfer & { knowledgeVersion: string };

/**
 * Assemble la forme d'affichage (entities/type.ts) a partir des lignes SQL.
 * lastActivityLabel est normalement calcule cote front (libelle relatif,
 * jamais stocke) ; faute d'un tel calcul ici, on renvoie l'ISO.
 */
export const emailFromRow = (
    row: EmailSqlInfer,
    versions: EmailVersionRow[],
): Email => ({
    id: row.id,
    contactName: row.prospectName,
    contactRole: row.prospectJob ?? "",
    company: row.prospectCompany ?? "",
    city: row.prospectLocation ?? "",
    recipient: row.prospectEmail,
    status: row.status,
    lastActivityAt: row.lastActivityAt.toISOString(),
    lastActivityLabel: row.lastActivityAt.toISOString(),
    versions: versions.map((version): EmailVersion => ({
        id: version.id,
        subject: version.subject,
        body: version.body,
        generatedAt: version.generatedAt.toISOString(),
        knowledgeVersion: version.knowledgeVersion ?? "",
    })),
})


export const emailToAgentSendInput = (email: EmailSqlInfer, version: EmailVersionSqlInfer): AgentEmailSendInput => {
    return {
        subject: version.subject,
        body: version.body,
        to: email.prospectEmail,
    }
}