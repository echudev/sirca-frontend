import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { items } from "./items";
import { ConsumableState } from "./types";
import { relations } from "drizzle-orm";

export const consumableDetail = pgTable("spare_parts_detail", {
  partId: serial("part_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  partState: varchar("part_state", { length: 20 })
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
