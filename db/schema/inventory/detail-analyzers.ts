import { integer, pgTable, varchar, date } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { items } from "./items";
import { AnalyzerState } from "./types";

export const analyzerDetail = pgTable("analyzers_detail", {
  analyzerId: integer("analyzer_id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  itemId: integer("item_id")
    .notNull()
    .unique()
    .references(() => items.id, { onDelete: "cascade" }),
  analyzerState: integer("analyzer_state").notNull().$type<AnalyzerState>(),
  itemSerialNumber: varchar("item_serial_number", { length: 40 }).notNull(),
  analyzerPollutant: varchar("analyzer_pollutant", { length: 40 }).notNull(),
  analyzerLastCalibration: date("analyzer_last_calibration"),
  analyzerLastMaintenance: date("analyzer_last_maintenance"),
});

export const AnalyzerDetailRelations = relations(analyzerDetail, ({ one }) => ({
  item: one(items, {
    fields: [analyzerDetail.itemId],
    references: [items.id],
  }),
}));
