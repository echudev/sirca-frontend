CREATE TABLE IF NOT EXISTS "analyzers_detail" (
	"analyzer_id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"item_id" integer NOT NULL,
	"analyzer_state" integer NOT NULL,
	"item_serial_number" varchar(40) NOT NULL,
	"analyzer_pollutant" varchar(40) NOT NULL,
	"analyzer_last_calibration" date,
	"analyzer_last_maintenance" date,
	CONSTRAINT "analyzers_detail_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spare_parts_detail" (
	"sparepart_id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"item_id" integer NOT NULL,
	"sparepart_state" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cylinders_detail" (
	"cylinder_id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"item_id" integer NOT NULL,
	"cylinder_number" varchar(30) NOT NULL,
	"cylinder_concentration" numeric(10, 2),
	"cylinder_connector" varchar(20) NOT NULL,
	"cylinder_expiration_date" date NOT NULL,
	"cylinder_certificate" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"item_id" integer NOT NULL,
	"station_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" varchar(100),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brands" (
	"id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"name" varchar(40) NOT NULL,
	CONSTRAINT "brands_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_subcategories" (
	"id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"name" text NOT NULL,
	"category_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"model_id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"model_name" varchar(40) NOT NULL,
	"brand_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"item_id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"item_name" varchar(30) NOT NULL,
	"item_subcategory_id" integer NOT NULL,
	"item_code" varchar(40) NOT NULL,
	"brand_id" integer,
	"model_id" integer,
	"acquisition_date" date NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "items_item_code_unique" UNIQUE("item_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sparepart_analyzer" (
	"spare_part_id" integer NOT NULL,
	"analyzer_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stations" (
	"station_id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"station_name" varchar(100) NOT NULL,
	"station_image_url" text,
	"station_latitude" numeric(9, 6),
	"station_longitude" numeric(9, 6),
	"station_address" text,
	"station_description" text,
	"operational_since" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "traslados" (
	"traslado_id" integer PRIMARY KEY DEFAULT GENERATED ALLWAYS AS IDENTITY NOT NULL,
	"item_id" integer NOT NULL,
	"station_id_origen" integer NOT NULL,
	"station_id_destino" integer NOT NULL,
	"cantidad" integer NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "station_check" CHECK ("traslados"."station_id_origen" <> "traslados"."station_id_destino"),
	CONSTRAINT "cantidad_check" CHECK ("traslados"."cantidad" > 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(40) NOT NULL,
	"email" varchar(40) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(10) DEFAULT 'VIEWER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" varchar(100),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analyzers_detail" ADD CONSTRAINT "analyzers_detail_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spare_parts_detail" ADD CONSTRAINT "spare_parts_detail_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cylinders_detail" ADD CONSTRAINT "cylinders_detail_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_station_id_stations_station_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("station_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_subcategories" ADD CONSTRAINT "item_subcategories_category_id_item_subcategories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."item_subcategories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_item_subcategory_id_item_subcategories_id_fk" FOREIGN KEY ("item_subcategory_id") REFERENCES "public"."item_subcategories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_model_id_models_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("model_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sparepart_analyzer" ADD CONSTRAINT "sparepart_analyzer_spare_part_id_spare_parts_detail_sparepart_id_fk" FOREIGN KEY ("spare_part_id") REFERENCES "public"."spare_parts_detail"("sparepart_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sparepart_analyzer" ADD CONSTRAINT "sparepart_analyzer_analyzer_id_analyzers_detail_analyzer_id_fk" FOREIGN KEY ("analyzer_id") REFERENCES "public"."analyzers_detail"("analyzer_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "traslados" ADD CONSTRAINT "traslados_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "traslados" ADD CONSTRAINT "traslados_station_id_origen_stations_station_id_fk" FOREIGN KEY ("station_id_origen") REFERENCES "public"."stations"("station_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "traslados" ADD CONSTRAINT "traslados_station_id_destino_stations_station_id_fk" FOREIGN KEY ("station_id_destino") REFERENCES "public"."stations"("station_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
