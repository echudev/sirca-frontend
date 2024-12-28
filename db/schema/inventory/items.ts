import { pgTable, varchar, text, serial, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ItemType } from "./types";
import { analyzersDetail } from "./analyzers-detail";
import { cylindersDetail } from "./cylinders-detail";
import { sparePartsDetail } from "./spare-part-detail";
import { sparePartAnalyzer } from "./spare-part-analyzer";
import { inventory } from "./inventory";
import { traslados } from "./traslados";
import { commonColumns } from "../common-columns";

export const items = pgTable("items", {
  id: serial("item_id").primaryKey(),
  itemType: varchar("item_type", { length: 20 }).notNull().$type<ItemType>(),
  name: varchar("item_name", { length: 100 }).notNull(),
  code: varchar("item_code", { length: 40 }).notNull().unique(),
  serialNumber: varchar("part_serialnumber", { length: 40 }).notNull(),
  description: text("item_description"),
  adquisitionDate: date("item_adquisition_date").notNull(),
  ...commonColumns,
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  analyzer: one(analyzersDetail),
  cylinder: one(cylindersDetail),
  spareParts: one(sparePartsDetail),
  inventory: many(inventory),
  traslados: many(traslados),
  repuestoLinks: many(sparePartAnalyzer),
  analizadorLinks: many(sparePartAnalyzer),
}));
