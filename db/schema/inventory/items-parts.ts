import { integer, pgTable } from "drizzle-orm/pg-core";
import { items } from "./items";
import { parts } from "./parts";
import { relations } from "drizzle-orm";

export const itemsToParts = pgTable("items_parts", {
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  partId: integer("part_id")
    .notNull()
    .references(() => parts.id),
});

export const itemsToPartsRelations = relations(itemsToParts, ({ one }) => ({
  item: one(items, {
    fields: [itemsToParts.itemId],
    references: [items.id],
  }),
  part: one(parts, {
    fields: [itemsToParts.partId],
    references: [parts.id],
  }),
}));
