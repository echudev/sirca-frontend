import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { itemModels } from "./item-models";

export const itemBrands = table("brands", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name", { length: 40 }).notNull().unique(),
});

export const itemBrandsRelations = relations(itemBrands, ({ many }) => ({
  models: many(itemModels),
}));
