import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { analyzerDetail } from "./detail-analyzers";
import { cylinderDetail } from "./detail-cylinders";
import { sparepartDetail } from "./detail-spareparts";
import { equipmentToSpareparts } from "./equipment-to-spareparts";
import { inventory } from "./inventory";
import { traslados } from "./traslados";
import { itemSubcategories } from "./item-subcategories";
import { itemModels } from "./item-models";
import { itemBrands } from "./item-brands";
import { commonColumns } from "../common-columns";

export const items = table("items", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name", { length: 30 }).notNull(),
  subcategoryID: t
    .integer("subcategory_id")
    .notNull()
    .references(() => itemSubcategories.id, { onDelete: "cascade" }),
  itemCode: t.varchar("item_code", { length: 40 }).notNull().unique(),
  brandId: t.integer("brand_id").references(() => itemBrands.id, {
    onDelete: "cascade",
  }),
  modelId: t.integer("model_id").references(() => itemModels.id, {
    onDelete: "cascade",
  }),
  acquisitionDate: t.date("acquisition_date").notNull(),
  updatedAt: commonColumns.updatedAt,
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  analyzerDetail: one(analyzerDetail),
  cylinderDetail: one(cylinderDetail),
  spareParts: one(sparepartDetail),
  subcategory: one(itemSubcategories),
  itemBrands: one(itemBrands),
  itemModels: one(itemModels),
  inventory: many(inventory),
  traslados: many(traslados),
  equipmentToSpareparts: many(equipmentToSpareparts),
  sparepartsToEquipment: many(equipmentToSpareparts),
}));
