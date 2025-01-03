import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { item } from "./item";
import { ConsumableState } from "./types";
import { relations } from "drizzle-orm";

export const detailConsumable = table("detail_consumable", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  itemId: t
    .integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "cascade" }),
  consumableState: t
    .varchar("consumable_state", { length: 20 })
    .notNull()
    .$type<ConsumableState>(),
});

export const DetailConsumableRelations = relations(
  detailConsumable,
  ({ one }) => ({
    item: one(item, {
      fields: [detailConsumable.itemId],
      references: [item.id],
    }),
  })
);
