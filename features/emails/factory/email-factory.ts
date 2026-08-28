import { EmailSqlInfer, EmailVersionSqlInfer } from "@/db/schemas";
import { Email, EmailVersion } from "../entities/type";
import { AgentEmailSendInput } from "@/features/agent/email/entities/agentEmail";


/**
 * Assemble la forme d'affichage (entities/type.ts) a partir des lignes SQL.
 * lastActivityLabel est normalement calcule cote front (libelle relatif,
 * jamais stocke) ; faute d'un tel calcul ici, on renvoie l'ISO.
 */
export const emailFromRow = (
    row: EmailSqlInfer,
    versions: EmailVersionSqlInfer[],
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