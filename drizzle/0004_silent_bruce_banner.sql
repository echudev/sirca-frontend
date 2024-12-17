CREATE TABLE IF NOT EXISTS "analyzer_states" (
	"analyzer_state_id" serial PRIMARY KEY NOT NULL,
	"state_name" varchar(20) NOT NULL,
	CONSTRAINT "analyzer_states_state_name_unique" UNIQUE("state_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analyzers" (
	"analyzer_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"model_id" integer NOT NULL,
	"analyzer_state_id" integer NOT NULL,
	"analyzer_serialnumber" varchar(40) NOT NULL,
	"analyzer_pollutant" varchar(40) NOT NULL,
	"analyzer_last_calibration" date,
	"analyzer_last_maintenance" date,
	CONSTRAINT "analyzers_item_id_unique" UNIQUE("item_id"),
	CONSTRAINT "analyzers_analyzer_serialnumber_unique" UNIQUE("analyzer_serialnumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brands" (
	"brand_id" serial PRIMARY KEY NOT NULL,
	"brand_name" varchar(40) NOT NULL,
	CONSTRAINT "brands_brand_name_unique" UNIQUE("brand_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cylinders" (
	"cylinder_id" serial PRIMARY KEY NOT NULL,
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
	"last_update" timestamp DEFAULT now() NOT NULL,
	"updated_by" varchar(40) NOT NULL,
	CONSTRAINT "quantity_check" CHECK ("inventory"."quantity" >= 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_types" (
	"item_type_id" serial PRIMARY KEY NOT NULL,
	"type_name" varchar(20) NOT NULL,
	CONSTRAINT "item_types_type_name_unique" UNIQUE("type_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"item_type_id" integer NOT NULL,
	"item_name" varchar(100) NOT NULL,
	"item_code" varchar(40) NOT NULL,
	"item_description" text,
	"item_adquisition_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "items_item_code_unique" UNIQUE("item_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items_parts" (
	"item_id" integer NOT NULL,
	"part_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"model_id" serial PRIMARY KEY NOT NULL,
	"model_name" varchar(40) NOT NULL,
	"brand_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "part_states" (
	"part_state_id" serial PRIMARY KEY NOT NULL,
	"part_state_name" varchar(20) NOT NULL,
	CONSTRAINT "part_states_part_state_name_unique" UNIQUE("part_state_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parts" (
	"part_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"part_number" varchar(30) NOT NULL,
	"part_serialnumber" varchar(40) NOT NULL,
	"part_state_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stations" (
	"station_id" serial PRIMARY KEY NOT NULL,
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
	"traslado_id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"station_id_origen" integer NOT NULL,
	"station_id_destino" integer NOT NULL,
	"cantidad" integer NOT NULL,
	"fecha_traslado" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "station_check" CHECK ("traslados"."station_id_origen" <> "traslados"."station_id_destino"),
	CONSTRAINT "cantidad_check" CHECK ("traslados"."cantidad" > 0)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analyzers" ADD CONSTRAINT "analyzers_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analyzers" ADD CONSTRAINT "analyzers_brand_id_brands_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("brand_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analyzers" ADD CONSTRAINT "analyzers_model_id_models_model_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("model_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analyzers" ADD CONSTRAINT "analyzers_analyzer_state_id_analyzer_states_analyzer_state_id_fk" FOREIGN KEY ("analyzer_state_id") REFERENCES "public"."analyzer_states"("analyzer_state_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cylinders" ADD CONSTRAINT "cylinders_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "items" ADD CONSTRAINT "items_item_type_id_item_types_item_type_id_fk" FOREIGN KEY ("item_type_id") REFERENCES "public"."item_types"("item_type_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_parts" ADD CONSTRAINT "items_parts_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_parts" ADD CONSTRAINT "items_parts_part_id_parts_part_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("part_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "models" ADD CONSTRAINT "models_brand_id_brands_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("brand_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parts" ADD CONSTRAINT "parts_item_id_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("item_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parts" ADD CONSTRAINT "parts_part_state_id_part_states_part_state_id_fk" FOREIGN KEY ("part_state_id") REFERENCES "public"."part_states"("part_state_id") ON DELETE cascade ON UPDATE no action;
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
