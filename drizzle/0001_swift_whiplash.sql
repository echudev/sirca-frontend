ALTER TABLE "items" ADD COLUMN "item_brand" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_item_brand_brands_brand_id_fk" FOREIGN KEY ("item_brand") REFERENCES "public"."brands"("brand_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
