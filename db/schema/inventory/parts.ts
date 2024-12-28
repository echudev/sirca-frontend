import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { items } from "./items";
import { PartState } from "./types";
import { relations } from "drizzle-orm";

export const parts = pgTable("parts", {
  id: serial("part_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  partNumber: varchar("part_number", { length: 30 }).notNull(),
  serialNumber: varchar("part_serialnumber", { length: 40 }).notNull(),
  partType: varchar("part_type", { length: 20 }).notNull(),
  partState: integer("part_state").notNull().$type<PartState>(),
});

export const partsRelations = relations(parts, ({ one }) => ({
  item: one(items, {
    fields: [parts.itemId],
    references: [items.id],
  }),
}));
