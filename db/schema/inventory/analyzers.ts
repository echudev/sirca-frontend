import { integer, pgTable, varchar, serial, date } from "drizzle-orm/pg-core";
import { items } from "./items";
import { brands } from "./brands";
import { models } from "./models";
import { AnalyzerState } from "./types";

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
  stateId: integer("analyzer_state_id").notNull().$type<AnalyzerState>(),
  serialNumber: varchar("analyzer_serialnumber", { length: 40 })
    .notNull()
    .unique(),
  pollutant: varchar("analyzer_pollutant", { length: 40 }).notNull(),
  lastCalibration: date("analyzer_last_calibration"),
  lastMaintenance: date("analyzer_last_maintenance"),
});
