import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { items } from "./items";
import { ConsumableState } from "./types";
import { relations } from "drizzle-orm";

export const consumableDetail = table("spare_parts_detail", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  itemId: t
    .integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  consumableState: t
    .varchar("consumable_state", { length: 20 })
    .notNull()
    .$type<ConsumableState>(),
});

export const ConsumableDetailRelations = relations(
  consumableDetail,
  ({ one }) => ({
    item: one(items, {
      fields: [consumableDetail.itemId],
      references: [items.id],
    }),
  })
);
