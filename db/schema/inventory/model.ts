import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { brand } from "./brand";
import { detailAnalizer } from "./detail-analyzer";

export const model = table("model", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("model_name", { length: 40 }).notNull(),
  brandId: t
    .integer("brand_id")
    .notNull()
    .references(() => brand.id, { onDelete: "cascade" }),
});

export const modelsRelations = relations(model, ({ one }) => ({
  brand: one(brand, {
    fields: [model.brandId],
    references: [brand.id],
  }),
  analyzer: one(detailAnalizer),
}));
