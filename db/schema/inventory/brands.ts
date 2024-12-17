import { pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { models } from "./models";

export const brands = pgTable("brands", {
  id: serial("brand_id").primaryKey(),
  name: varchar("brand_name", { length: 40 }).notNull().unique(),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  models: many(models),
}));
