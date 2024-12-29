import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";
import { items } from "./items";
import { SparePartState, SparePartType } from "./types";
import { relations } from "drizzle-orm";

export const sparePartsDetail = pgTable("spare_parts_detail", {
  id: serial("spare_part_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  partNumber: varchar("part_number", { length: 30 }).notNull(),
  serialNumber: varchar("part_serialnumber", { length: 40 }).notNull(),
  sparePartType: varchar("spare_part_type", { length: 20 })
    .notNull()
    .$type<SparePartType>(),
  sparePartState: varchar("spare_part_state", { length: 20 })
    .notNull()
    .$type<SparePartState>(),
});

export const sparePartRelations = relations(sparePartsDetail, ({ one }) => ({
  item: one(items, {
    fields: [sparePartsDetail.itemId],
    references: [items.id],
  }),
}));
