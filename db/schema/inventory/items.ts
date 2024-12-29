import {
  pgTable,
  varchar,
  text,
  serial,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ItemType } from "./types";
import { analyzersDetail } from "./analyzers-detail";
import { cylindersDetail } from "./cylinders-detail";
import { sparePartsDetail } from "./spare-part-detail";
import { sparePartAnalyzer } from "./spare-part-analyzer";
import { inventory } from "./inventory";
import { traslados } from "./traslados";
import { brands } from "./brands";
import { models } from "./models";
import { commonColumns } from "../common-columns";

export const items = pgTable("items", {
  id: serial("item_id").primaryKey(),
  itemType: varchar("item_type", { length: 20 }).notNull().$type<ItemType>(),
  brands: integer("item_brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  models: integer("item_model_id")
    .notNull()
    .references(() => models.id, { onDelete: "cascade" }),
  name: varchar("item_name", { length: 100 }).notNull(),
  code: varchar("item_code", { length: 40 }).notNull().unique(),
  serialNumber: varchar("part_serialnumber", { length: 40 }).notNull(),
  description: text("item_description"),
  itemImage: text("item_image"),
  adquisitionDate: date("item_adquisition_date").notNull(),
  ...commonColumns,
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  analyzer: one(analyzersDetail),
  cylinder: one(cylindersDetail),
  brand: one(brands),
  model: one(models),
  spareParts: one(sparePartsDetail),
  inventory: many(inventory),
  traslados: many(traslados),
  repuestoLinks: many(sparePartAnalyzer),
  analizadorLinks: many(sparePartAnalyzer),
}));
