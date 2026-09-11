CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_name" text NOT NULL,
	"size" integer NOT NULL,
	"type" text NOT NULL,
	"extension" text NOT NULL,
	"path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_base" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"file_id" uuid NOT NULL,
	"indexed_by" text,
	"status" text DEFAULT 'processing' NOT NULL,
	"error_message" text,
	"total_indexed" integer,
	"count_words" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "knowledge_base_name_unique" UNIQUE("name"),
	CONSTRAINT "knowledge_base_file_id_unique" UNIQUE("file_id")
);
--> statement-breakpoint
ALTER TABLE "email_versions" ADD COLUMN "knowledge_base_id" uuid;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_indexed_by_user_id_fk" FOREIGN KEY ("indexed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "knowledge_base_status_idx" ON "knowledge_base" USING btree ("status");--> statement-breakpoint
ALTER TABLE "email_versions" ADD CONSTRAINT "email_versions_knowledge_base_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_base_id") REFERENCES "public"."knowledge_base"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_versions_knowledge_base_id_idx" ON "email_versions" USING btree ("knowledge_base_id");