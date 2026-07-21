CREATE TYPE "public"."currency" AS ENUM('MAD', 'EUR');--> statement-breakpoint
CREATE TYPE "public"."guide_category" AS ENUM('acheter_au_maroc', 'quartiers', 'investissement', 'renovation', 'vivre_a_marrakech');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('formulaire', 'whatsapp', 'telephone');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('nouveau', 'contacte', 'qualifie', 'converti', 'perdu');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."partner_category" AS ENUM('notaire', 'architecte', 'architecte_interieur', 'conciergerie', 'artisan', 'mobilier');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('draft', 'published', 'sous_offre', 'vendu', 'loue', 'archive');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('villa', 'riad', 'appartement', 'studio', 'maison', 'terrain', 'ferme', 'duplex', 'penthouse', 'local_commercial');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('vente', 'location');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'agent', 'proprietaire', 'acheteur');--> statement-breakpoint
CREATE TABLE "combo_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction" "transaction_type" NOT NULL,
	"type" "property_type" NOT NULL,
	"quartier_id" uuid NOT NULL,
	"intro_fr" text,
	"intro_en" text,
	"faq" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title_fr" text NOT NULL,
	"title_en" text,
	"excerpt_fr" text,
	"excerpt_en" text,
	"content_fr" text,
	"content_en" text,
	"cover_url" text,
	"category" "guide_category" NOT NULL,
	"related_type" "property_type",
	"related_quartier_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"message" text,
	"source" "lead_source" NOT NULL,
	"locale" text DEFAULT 'fr' NOT NULL,
	"page_url" text,
	"status" "lead_status" DEFAULT 'nouveau' NOT NULL,
	"internal_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" "partner_category" NOT NULL,
	"bio_fr" text,
	"bio_en" text,
	"logo_url" text,
	"published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'acheteur' NOT NULL,
	"full_name" text,
	"phone" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"reference" text NOT NULL,
	"type" "property_type" NOT NULL,
	"transaction" "transaction_type" NOT NULL,
	"status" "property_status" DEFAULT 'draft' NOT NULL,
	"title_fr" text NOT NULL,
	"title_en" text,
	"description_fr" text,
	"description_en" text,
	"price" integer,
	"currency" "currency" DEFAULT 'MAD' NOT NULL,
	"price_on_request" boolean DEFAULT false NOT NULL,
	"surface_habitable" integer,
	"surface_terrain" integer,
	"chambres" integer,
	"sdb" integer,
	"etages" integer,
	"annee_construction" integer,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"quartier_id" uuid,
	"ville" text DEFAULT 'Marrakech' NOT NULL,
	"adresse_privee" text,
	"lat" double precision,
	"lng" double precision,
	"exclusivite" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"video_url" text,
	"visite_virtuelle_url" text,
	"meta_title_fr" text,
	"meta_title_en" text,
	"meta_description_fr" text,
	"meta_description_en" text,
	"owner_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_fr" text NOT NULL,
	"alt_en" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"kind" "media_kind" DEFAULT 'image' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quartiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_fr" text NOT NULL,
	"name_en" text NOT NULL,
	"intro_fr" text,
	"intro_en" text,
	"content_fr" text,
	"content_en" text,
	"faq" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"lat" double precision,
	"lng" double precision,
	"cover_url" text,
	"position" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slug_redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"old_slug" text NOT NULL,
	"new_slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "combo_content" ADD CONSTRAINT "combo_content_quartier_id_quartiers_id_fk" FOREIGN KEY ("quartier_id") REFERENCES "public"."quartiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guides" ADD CONSTRAINT "guides_related_quartier_id_quartiers_id_fk" FOREIGN KEY ("related_quartier_id") REFERENCES "public"."quartiers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_quartier_id_quartiers_id_fk" FOREIGN KEY ("quartier_id") REFERENCES "public"."quartiers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_media" ADD CONSTRAINT "property_media_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "combo_content_combo_idx" ON "combo_content" USING btree ("transaction","type","quartier_id");--> statement-breakpoint
CREATE UNIQUE INDEX "guides_slug_idx" ON "guides" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "guides_category_idx" ON "guides" USING btree ("category");--> statement-breakpoint
CREATE INDEX "guides_related_quartier_idx" ON "guides" USING btree ("related_quartier_id");--> statement-breakpoint
CREATE INDEX "leads_status_created_idx" ON "leads" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "properties_slug_idx" ON "properties" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "properties_reference_idx" ON "properties" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "properties_listing_idx" ON "properties" USING btree ("status","transaction","type","quartier_id");--> statement-breakpoint
CREATE INDEX "properties_featured_idx" ON "properties" USING btree ("featured","status");--> statement-breakpoint
CREATE INDEX "properties_published_at_idx" ON "properties" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "property_media_property_position_idx" ON "property_media" USING btree ("property_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "quartiers_slug_idx" ON "quartiers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "quartiers_published_position_idx" ON "quartiers" USING btree ("published","position");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_redirects_old_slug_idx" ON "slug_redirects" USING btree ("old_slug");