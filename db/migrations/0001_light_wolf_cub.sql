CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"street" text,
	"city" text,
	"city_key" text,
	"zip" text,
	"region" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"name_key" text NOT NULL,
	"city_key" text,
	"website" text,
	"description" text,
	"industry_raw" text,
	"sector_id" uuid,
	"size_raw" text,
	"headcount_min" integer,
	"headcount_max" integer,
	"address_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_name_city_unique" UNIQUE NULLS NOT DISTINCT("name_key","city_key")
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_keywords" (
	"company_id" uuid NOT NULL,
	"keyword_id" uuid NOT NULL,
	CONSTRAINT "company_keywords_company_id_keyword_id_pk" PRIMARY KEY("company_id","keyword_id")
);
--> statement-breakpoint
CREATE TABLE "keywords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_technologies" (
	"company_id" uuid NOT NULL,
	"technology_id" uuid NOT NULL,
	CONSTRAINT "company_technologies_company_id_technology_id_pk" PRIMARY KEY("company_id","technology_id")
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"email_key" text NOT NULL,
	"job_title" text,
	"phone" text,
	"linkedin_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"is_kept" boolean DEFAULT false NOT NULL,
	"raw_payload" jsonb,
	"last_sourced_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_results" (
	"search_id" uuid NOT NULL,
	"prospect_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "search_results_search_id_prospect_id_pk" PRIMARY KEY("search_id","prospect_id")
);
--> statement-breakpoint
CREATE TABLE "searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"criteria" jsonb NOT NULL,
	"criteria_label" text NOT NULL,
	"result_count" integer DEFAULT 0 NOT NULL,
	"launched_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sectors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_keywords" ADD CONSTRAINT "company_keywords_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_keywords" ADD CONSTRAINT "company_keywords_keyword_id_keywords_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keywords"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_technologies" ADD CONSTRAINT "company_technologies_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_technologies" ADD CONSTRAINT "company_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_results" ADD CONSTRAINT "search_results_search_id_searches_id_fk" FOREIGN KEY ("search_id") REFERENCES "public"."searches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_results" ADD CONSTRAINT "search_results_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "searches" ADD CONSTRAINT "searches_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "addresses_city_key_idx" ON "addresses" USING btree ("city_key");--> statement-breakpoint
CREATE INDEX "companies_sector_id_idx" ON "companies" USING btree ("sector_id");--> statement-breakpoint
CREATE INDEX "companies_headcount_min_idx" ON "companies" USING btree ("headcount_min");--> statement-breakpoint
CREATE UNIQUE INDEX "sectors_slug_idx" ON "sectors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "company_keywords_keyword_id_idx" ON "company_keywords" USING btree ("keyword_id");--> statement-breakpoint
CREATE UNIQUE INDEX "keywords_slug_idx" ON "keywords" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "company_technologies_technology_id_idx" ON "company_technologies" USING btree ("technology_id");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_slug_idx" ON "technologies" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "persons_email_key_idx" ON "persons" USING btree ("email_key");--> statement-breakpoint
CREATE UNIQUE INDEX "prospects_person_company_idx" ON "prospects" USING btree ("person_id","company_id");--> statement-breakpoint
CREATE INDEX "prospects_company_id_idx" ON "prospects" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "prospects_is_kept_idx" ON "prospects" USING btree ("is_kept");--> statement-breakpoint
CREATE INDEX "search_results_prospect_id_idx" ON "search_results" USING btree ("prospect_id");