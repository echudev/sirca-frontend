ALTER TABLE "items" RENAME COLUMN "item_brand" TO "item_model_id";--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_item_brand_brands_brand_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_item_model_id_models_model_id_fk" FOREIGN KEY ("item_model_id") REFERENCES "public"."models"("model_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
