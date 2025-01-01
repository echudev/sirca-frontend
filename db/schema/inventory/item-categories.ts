import { integer, text, pgTable } from "drizzle-orm/pg-core";
import { commonColumns } from "../common-columns";
import { sql } from "drizzle-orm";

export const itemCategories = pgTable("item_subcategories", {
  id: integer("id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  name: text("name").notNull(),
  updatedAt: commonColumns.updatedAt,
});
