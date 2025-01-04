import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { itemCategory } from "./item-category";
import { commonColumns } from "../common-columns";

export const itemSubcategory = table("item_subcategory", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull().unique(),
  categoryId: t
    .integer("category_id")
    .notNull()
    .references(() => itemCategory.id, {
      onDelete: "cascade",
    }),
  updatedAt: commonColumns.updatedAt,
});

export const itemSubcategoriesRelations = relations(
  itemSubcategory,
  ({ one }) => ({
    category: one(itemCategory),
  })
);
