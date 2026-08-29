ALTER TABLE "prospects" ALTER COLUMN "prospecting_consent" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "prospects" ADD COLUMN "prospected_at" timestamp;