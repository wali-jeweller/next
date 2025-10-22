CREATE TABLE "markets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"currency" text NOT NULL,
	"region" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "material_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material" text NOT NULL,
	"market_id" uuid NOT NULL,
	"price_per_gram" integer NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "product_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"market_id" uuid NOT NULL,
	"base_price" integer,
	"making_charges" integer DEFAULT 0 NOT NULL,
	"discount_percentage" real DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "material_rates" ADD CONSTRAINT "material_rates_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_pricing" ADD CONSTRAINT "product_pricing_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_pricing" ADD CONSTRAINT "product_pricing_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "markets_code_idx" ON "markets" USING btree ("code");--> statement-breakpoint
CREATE INDEX "markets_is_active_idx" ON "markets" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "material_rates_material_idx" ON "material_rates" USING btree ("material");--> statement-breakpoint
CREATE INDEX "material_rates_market_id_idx" ON "material_rates" USING btree ("market_id");--> statement-breakpoint
CREATE INDEX "material_rates_effective_idx" ON "material_rates" USING btree ("effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "product_pricing_unique_idx" ON "product_pricing" USING btree ("product_id","market_id");--> statement-breakpoint
CREATE INDEX "product_pricing_product_id_idx" ON "product_pricing" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_pricing_market_id_idx" ON "product_pricing" USING btree ("market_id");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "discounted_price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "making_charges";