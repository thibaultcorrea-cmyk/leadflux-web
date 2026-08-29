DROP VIEW "public"."kpi_email_stats";--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "issuer" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" USING btree ("issuer","account_id");--> statement-breakpoint
CREATE VIEW "public"."kpi_email_stats" AS (select (select count(*) from "search_results")::int as "total_prospects", count(*)::int as "total_sent", count(*) filter (where "status" = 'draft')::int as "drafted", count(*) filter (where "status" = 'sent')::int as "sent", count(*) filter (where "status" = 'replied')::int as "replied", round(
                count(*) filter (where "status" = 'replied')::numeric
                / nullif(count(*) filter (where "status" in ('sent', 'replied')), 0) * 100,
                1
            )::float as "replied_rate" from "emails");