import { integer, pgTable, varchar, serial, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items } from "./items";
import { brands } from "./brands";
import { models } from "./models";
import { AnalyzerState } from "./types";

export const analyzersDetail = pgTable("analyzers_detail", {
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
  analyzerState: integer("analyzer_state").notNull().$type<AnalyzerState>(),
  pollutant: varchar("analyzer_pollutant", { length: 40 }).notNull(),
  lastCalibration: date("analyzer_last_calibration"),
  lastMaintenance: date("analyzer_last_maintenance"),
});

export const analyzerRelations = relations(analyzersDetail, ({ one }) => ({
  item: one(items, {
    fields: [analyzersDetail.itemId],
    references: [items.id],
  }),
  brand: one(brands, {
    fields: [analyzersDetail.brandId],
    references: [brands.id],
  }),
  model: one(models, {
    fields: [analyzersDetail.modelId],
    references: [models.id],
  }),
}));
