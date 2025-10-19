ALTER TABLE "content_pages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "store_pages" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "content_pages" CASCADE;--> statement-breakpoint
DROP TABLE "store_pages" CASCADE;--> statement-breakpoint
ALTER TABLE "daily_gold_rates" RENAME TO "daily_material_rates";--> statement-breakpoint
DROP INDEX "blog_posts_id_idx";--> statement-breakpoint
DROP INDEX "blog_posts_published_at_idx";--> statement-breakpoint
DROP INDEX "carts_user_id_idx";--> statement-breakpoint
DROP INDEX "daily_gold_rates_id_idx";--> statement-breakpoint
DROP INDEX "orders_user_id_idx";--> statement-breakpoint
DROP INDEX "product_slug_redirects_id_idx";--> statement-breakpoint
DROP INDEX "promotions_id_idx";--> statement-breakpoint
DROP INDEX "wishlists_user_id_idx";--> statement-breakpoint
ALTER TABLE "daily_material_rates" ADD COLUMN "material" text;