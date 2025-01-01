import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { itemBrands } from "./item-brands";
import { analyzerDetail } from "./detail-analyzers";

export const itemModels = pgTable("models", {
  id: integer("model_id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  name: varchar("model_name", { length: 40 }).notNull(),
  brandId: integer("brand_id")
    .notNull()
    .references(() => itemBrands.id, { onDelete: "cascade" }),
});

export const modelsRelations = relations(itemModels, ({ one }) => ({
  brand: one(itemBrands, {
    fields: [itemModels.brandId],
    references: [itemBrands.id],
  }),
  analyzer: one(analyzerDetail),
}));
