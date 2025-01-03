import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { commonColumns } from "../common-columns";

export const itemCategories = table("item_subcategories", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.text("name").notNull(),
  updatedAt: commonColumns.updatedAt,
});
