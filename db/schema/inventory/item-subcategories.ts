import { relations, sql } from "drizzle-orm";
import { integer, text, pgTable } from "drizzle-orm/pg-core";
import { itemCategories } from "./item-categories";
import { commonColumns } from "../common-columns";

export const itemSubcategories = pgTable("item_subcategories", {
  id: integer("id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  name: text("name").notNull(),
  categoryId: integer("category_id")
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
