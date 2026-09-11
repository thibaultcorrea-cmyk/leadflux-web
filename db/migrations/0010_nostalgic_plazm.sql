ALTER TABLE "email_versions" ALTER COLUMN "knowledge_base_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "email_versions" DROP COLUMN "knowledge_version";