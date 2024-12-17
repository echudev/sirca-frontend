import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { items } from "./items";
import { itemsToParts } from "./items-parts";
import { relations } from "drizzle-orm";
import { PartState } from "./types";

export const parts = pgTable("parts", {
  id: serial("part_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  partNumber: varchar("part_number", { length: 30 }).notNull(),
  serialNumber: varchar("part_serialnumber", { length: 40 }).notNull(),
  stateId: integer("part_state_id").notNull().$type<PartState>(),
});

export const partsRelations = relations(parts, ({ many }) => ({
  itemParts: many(itemsToParts),
}));
