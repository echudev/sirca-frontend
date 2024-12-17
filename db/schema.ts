import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  serial,
  decimal,
  date,
  check,
} from "drizzle-orm/pg-core";
import {
  sql,
  relations,
  InferSelectModel,
  InferInsertModel,
} from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 40 }).notNull().unique(),
  email: varchar({ length: 40 }).notNull().unique(),
  password: text("password_hash").notNull(),
  role: varchar({ length: 10 }).default("VIEWER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type User = InferSelectModel<typeof usersTable>;
export type NewUser = InferInsertModel<typeof usersTable>;

export const itemTypes = pgTable("item_types", {
  id: serial("item_type_id").primaryKey(),
  name: varchar("item_type_name", { length: 20 }).notNull().unique(),
});

export const analyzerStates = pgTable("analyzer_states", {
  id: serial("analyzer_state_id").primaryKey(),
  name: varchar("analyzer_state_name", { length: 20 }).notNull().unique(),
});

export const partStates = pgTable("part_states", {
  id: serial("part_state_id").primaryKey(),
  name: varchar("part_state_name", { length: 20 }).notNull().unique(),
});

export const brands = pgTable("brands", {
  id: serial("brand_id").primaryKey(),
  name: varchar("brand_name", { length: 40 }).notNull().unique(),
});

export const models = pgTable("models", {
  id: serial("model_id").primaryKey(),
  name: varchar("model_name", { length: 40 }).notNull(),
  brandId: integer("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  models: many(models),
}));

export const modelsRelations = relations(models, ({ one }) => ({
  brand: one(brands, {
    fields: [models.brandId],
    references: [brands.id],
  }),
}));

export const items = pgTable("items", {
  id: serial("item_id").primaryKey(),
  itemTypeId: integer("item_type_id")
    .notNull()
    .references(() => itemTypes.id, { onDelete: "restrict" }),
  name: varchar("item_name", { length: 100 }).notNull(),
  code: varchar("item_code", { length: 40 }).notNull().unique(),
  description: text("item_description"),
  adquisitionDate: date("item_adquisition_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const parts = pgTable("parts", {
  id: serial("part_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  partNumber: varchar("part_number", { length: 30 }).notNull(),
  serialNumber: varchar("part_serialnumber", { length: 40 }).notNull(),
  stateId: integer("part_state_id")
    .notNull()
    .references(() => partStates.id, { onDelete: "cascade" }),
});

export const itemsToParts = pgTable("items_parts", {
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  partId: integer("part_id")
    .notNull()
    .references(() => parts.id),
});

export const analyzers = pgTable("analyzers", {
  id: serial("analyzer_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .unique()
    .references(() => items.id, { onDelete: "cascade" }),
  brandId: integer("brand_id")
    .notNull()
    .references(() => brands.id),
  modelId: integer("model_id")
    .notNull()
    .references(() => models.id, { onDelete: "cascade" }),
  stateId: integer("analyzer_state_id")
    .notNull()
    .references(() => analyzerStates.id, { onDelete: "cascade" }),
  serialNumber: varchar("analyzer_serialnumber", { length: 40 })
    .notNull()
    .unique(),
  pollutant: varchar("analyzer_pollutant", { length: 40 }).notNull(),
  lastCalibration: date("analyzer_last_calibration"),
  lastMaintenance: date("analyzer_last_maintenance"),
});

export const cylinders = pgTable("cylinders", {
  id: serial("cylinder_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  number: varchar("cylinder_number", { length: 30 }).notNull(),
  concentration: decimal("cylinder_concentration", { precision: 10, scale: 2 }),
  connector: varchar("cylinder_connector", { length: 20 }).notNull(),
  expirationDate: date("cylinder_expiration_date").notNull(),
  certificate: text("cylinder_certificate"),
});

export const stations = pgTable("stations", {
  id: serial("station_id").primaryKey(),
  name: varchar("station_name", { length: 100 }).notNull(),
  imageUrl: text("station_image_url"),
  latitude: decimal("station_latitude", { precision: 9, scale: 6 }),
  longitude: decimal("station_longitude", { precision: 9, scale: 6 }),
  address: text("station_address"),
  description: text("station_description"),
  operationalSince: date("operational_since"),
});

export const inventory = pgTable(
  "inventory",
  {
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    stationId: integer("station_id")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    lastUpdate: timestamp("last_update").defaultNow().notNull(),
    updatedBy: varchar("updated_by", { length: 40 }).notNull(),
  },
  (table) => [check("quantity_check", sql`${table.quantity} >= 0`)]
);

export const traslados = pgTable(
  "traslados",
  {
    id: serial("traslado_id").primaryKey(),
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    fromStationId: integer("station_id_origen")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    toStationId: integer("station_id_destino")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    quantity: integer("cantidad").notNull(),
    createdAt: timestamp("fecha_traslado").defaultNow().notNull(),
  },
  (table) => [
    check("station_check", sql`${table.fromStationId} <> ${table.toStationId}`),
    check("cantidad_check", sql`${table.quantity} > 0`),
  ]
);
