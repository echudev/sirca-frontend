import { integer, pgTable } from "drizzle-orm/pg-core";
import { items } from "./items";
import { sparePartsDetail } from "./spare-part-detail";
import { analyzersDetail } from "./analyzers-detail";
import { relations } from "drizzle-orm";

export const sparePartAnalyzer = pgTable("sparepart_analyzer", {
  sparePartId: integer("spare_part_id")
    .notNull()
    .references(() => sparePartsDetail.id, { onDelete: "cascade" }),
  analyzerId: integer("analyzer_id")
    .notNull()
    .references(() => analyzersDetail.id, { onDelete: "cascade" }),
});

export const repuestoAnalyzadorRelations = relations(
  sparePartAnalyzer,
  ({ one }) => ({
    repuesto: one(items, {
      fields: [sparePartAnalyzer.sparePartId],
      references: [items.id],
    }),
    analizador: one(items, {
      fields: [sparePartAnalyzer.analyzerId],
      references: [items.id],
    }),
  })
);
