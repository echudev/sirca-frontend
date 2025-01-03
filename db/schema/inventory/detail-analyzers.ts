import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items } from "./items";
import { AnalyzerState } from "./types";

export const analyzerDetail = table("analyzers_detail", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  itemId: t
    .integer("item_id")
    .notNull()
    .unique()
    .references(() => items.id, { onDelete: "cascade" }),
  analyzerState: t.integer("analyzer_state").notNull().$type<AnalyzerState>(),
  itemSerialNumber: t.varchar("item_serial_number", { length: 40 }).notNull(),
  analyzerPollutant: t.varchar("analyzer_pollutant", { length: 40 }).notNull(),
  analyzerLastCalibration: t.date("analyzer_last_calibration"),
  analyzerLastMaintenance: t.date("analyzer_last_maintenance"),
});

export const AnalyzerDetailRelations = relations(analyzerDetail, ({ one }) => ({
  item: one(items, {
    fields: [analyzerDetail.itemId],
    references: [items.id],
  }),
}));
