ALTER TABLE "collection_products" ADD COLUMN "rank" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_products" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_products" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "visibility" text DEFAULT 'public';