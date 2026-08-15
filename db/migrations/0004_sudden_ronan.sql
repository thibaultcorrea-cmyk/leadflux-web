CREATE TABLE "email_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"body" jsonb NOT NULL,
	"knowledge_version" text,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_name" text NOT NULL,
	"prospect_job" text,
	"prospect_email" text NOT NULL,
	"prospecting_consent" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"validated_by" text,
	"sent_at" timestamp,
	"replied_at" timestamp,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prospects" ADD COLUMN "prospecting_consent" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "email_versions" ADD CONSTRAINT "email_versions_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_validated_by_user_id_fk" FOREIGN KEY ("validated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_versions_email_id_idx" ON "email_versions" USING btree ("email_id");--> statement-breakpoint
CREATE INDEX "emails_prospect_email_idx" ON "emails" USING btree ("prospect_email");--> statement-breakpoint
CREATE INDEX "emails_status_idx" ON "emails" USING btree ("status");