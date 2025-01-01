import { pgTable, varchar, date, integer } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { analyzerDetail } from "./detail-analyzers";
import { cylinderDetail } from "./detail-cylinders";
import { sparepartDetail } from "./detail-spareparts";
import { sparePartAnalyzer } from "./sparepart-analyzer";
import { inventory } from "./inventory";
import { traslados } from "./traslados";
import { itemSubcategories } from "./item-subcategories";
import { itemModels } from "./item-models";
import { itemBrands } from "./item-brands";
import { commonColumns } from "../common-columns";

export const items = pgTable("items", {
  id: integer("item_id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  itemName: varchar("item_name", { length: 30 }).notNull(),
  itemSubcategoryID: integer("item_subcategory_id")
    .notNull()
    .references(() => itemSubcategories.id, { onDelete: "cascade" }),
  itemCode: varchar("item_code", { length: 40 }).notNull().unique(),
  brandId: integer("brand_id").references(() => itemBrands.id, {
    onDelete: "cascade",
  }),
  modelId: integer("model_id").references(() => itemModels.id, {
    onDelete: "cascade",
  }),
  acquisitionDate: date("acquisition_date").notNull(),
  updatedAt: commonColumns.updatedAt,
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  analyzer: one(analyzerDetail),
  cylinder: one(cylinderDetail),
  subcategory: one(itemSubcategories),
  model: one(itemModels),
  spareParts: one(sparepartDetail),
  inventory: many(inventory),
  traslados: many(traslados),
  repuestoLinks: many(sparePartAnalyzer),
  analizadorLinks: many(sparePartAnalyzer),
}));
