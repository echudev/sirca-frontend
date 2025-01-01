import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { itemModels } from "./item-models";

export const itemBrands = pgTable("brands", {
  id: integer("id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  name: varchar("name", { length: 40 }).notNull().unique(),
});

export const itemBrandsRelations = relations(itemBrands, ({ many }) => ({
  models: many(itemModels),
}));
