import {
  integer,
  pgTable,
  varchar,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { brands } from "./brands";
import { analyzers } from "./analyzers";

export const models = pgTable("models", {
  id: serial("model_id").primaryKey(),
  name: varchar("model_name", { length: 40 }).notNull(),
  brandId: integer("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const modelsRelations = relations(models, ({ one }) => ({
  brand: one(brands, {
    fields: [models.brandId],
    references: [brands.id],
  }),
  analyzer: one(analyzers),
}));
