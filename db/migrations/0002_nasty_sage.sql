CREATE TABLE "industries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sectors" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sectors" CASCADE;--> statement-breakpoint
ALTER TABLE "companies" RENAME COLUMN "sector_id" TO "industry_id";--> statement-breakpoint
DROP INDEX "companies_sector_id_idx";--> statement-breakpoint
DROP INDEX "prospects_is_kept_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "sectors_slug_idx" ON "industries" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "companies_industry_id_idx" ON "companies" USING btree ("industry_id");--> statement-breakpoint
ALTER TABLE "prospects" DROP COLUMN "is_kept";