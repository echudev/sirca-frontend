import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { itemCategories } from "./item-categories";
import { commonColumns } from "../common-columns";

export const itemSubcategories = table("item_subcategories", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull(),
  categoryId: t
    .integer("category_id")
    .notNull()
    .references(() => itemCategories.id, {
      onDelete: "cascade",
    }),
  updatedAt: commonColumns.updatedAt,
});

export const itemSubcategoriesRelations = relations(
  itemSubcategories,
  ({ one }) => ({
    category: one(itemCategories),
  })
);
