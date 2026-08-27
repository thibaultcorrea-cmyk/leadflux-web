CREATE VIEW "public"."kpi_stats" AS (select (select count(*) from "prospects")::int as "total_prospects", count(*)::int as "total_emails", count(*) filter (where "status" = 'draft')::int as "drafted_emails", count(*) filter (where "status" = 'sent')::int as "sent_emails", count(*) filter (where "status" = 'replied')::int as "replied_emails", round(
                count(*) filter (where "status" = 'replied')::numeric
                / nullif(count(*) filter (where "status" in ('sent', 'replied')), 0) * 100,
                1
            )::float as "replied_rate" from "emails");