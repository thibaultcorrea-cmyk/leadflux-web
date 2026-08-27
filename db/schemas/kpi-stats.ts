import { pgView } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { emails } from "./emails";
import { prospects } from "./prospects";

/**
 * KPIs du Tableau : une ligne unique de compteurs agreges sur toute la table
 * (pas de GROUP BY), via des `filter` plutot qu'un `count(*) OVER()` reste
 * identique recopie sur chaque colonne (bug de la version precedente : les
 * 7 colonnes renvoyaient toutes le meme total, sur une ligne par email).
 *
 * emails n'a pas de relation vers prospects (duplication volontaire des
 * donnees de contact, cf. emails.ts) : total_prospects passe donc par une
 * sous-requete scalaire plutot qu'un join.
 *
 * Pas de colonne "bounced" : EMAIL_STATUSES ne connait que draft/sent/replied
 * (CLAUDE.md interdit tout KPI qui suppose un envoi automatique). Un statut
 * de bounce n'existe pas dans le modele.
 *
 * Casts ::int / ::float explicites : count()/round() renvoient des
 * bigint/numeric que le driver pg renvoie en string, pas en number.
 */
export const kpiStats = pgView("kpi_stats").as((qb) =>
    qb
        .select({
            totalProspects: sql<number>`(select count(*) from ${prospects})::int`.as("total_prospects"),
            totalSentEmails: sql<number>`count(*)::int`.as("total_emails"),
            draftedEmails: sql<number>`count(*) filter (where ${emails.status} = 'draft')::int`.as("drafted_emails"),
            sentEmails: sql<number>`count(*) filter (where ${emails.status} = 'sent')::int`.as("sent_emails"),
            repliedEmails: sql<number>`count(*) filter (where ${emails.status} = 'replied')::int`.as("replied_emails"),
            /** Reponses / emails effectivement sortis (sent + replied), pas / total incluant les brouillons. */
            repliedRate: sql<number>`round(
                count(*) filter (where ${emails.status} = 'replied')::numeric
                / nullif(count(*) filter (where ${emails.status} in ('sent', 'replied')), 0) * 100,
                1
            )::float`.as("replied_rate"),
        })
        .from(emails)
);

export type KpiStatsSqlInfer = typeof kpiStats.$inferSelect;