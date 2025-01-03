import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { detailAnalizer } from "./detail-analyzer";
import { detailCylinder } from "./detail-cylinders";
import { detailSparepart } from "./detail-sparepart";
import { equipmentToSpareparts } from "./equipment-to-spareparts";
import { inventory } from "./inventory";
import { traslados } from "./traslados";
import { itemSubcategories } from "./item-subcategories";
import { model } from "./model";
import { brand } from "./brand";
import { commonColumns } from "../common-columns";

export const item = table("item", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name", { length: 30 }).notNull(),
  itemCode: t.varchar("item_code", { length: 40 }).notNull().unique(),
  subcategoryID: t
    .integer("subcategory_id")
    .notNull()
    .references(() => itemSubcategories.id, { onDelete: "cascade" }),
  acquisitionDate: t.date("acquisition_date").notNull(),
  updatedAt: commonColumns.updatedAt,
});

export const itemsRelations = relations(item, ({ one, many }) => ({
  analyzerDetail: one(detailAnalizer),
  cylinderDetail: one(detailCylinder),
  spareParts: one(detailSparepart),
  subcategory: one(itemSubcategories),
  itemBrands: one(brand),
  itemModels: one(model),
  inventory: many(inventory),
  traslados: many(traslados),
  equipmentToSpareparts: many(equipmentToSpareparts),
  sparepartsToEquipment: many(equipmentToSpareparts),
}));
