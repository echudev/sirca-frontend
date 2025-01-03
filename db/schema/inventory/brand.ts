import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { model } from "./model";

export const brand = table("brand", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name", { length: 40 }).notNull().unique(),
});

export const BrandRelations = relations(brand, ({ many }) => ({
  models: many(model),
}));
