import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { itemBrands } from "./item-brands";
import { analyzerDetail } from "./detail-analyzers";

export const itemModels = table("models", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("model_name", { length: 40 }).notNull(),
  brandId: t
    .integer("brand_id")
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
