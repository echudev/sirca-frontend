import {
  integer,
  pgTable,
  varchar,
  serial,
  boolean,
} from "drizzle-orm/pg-core";
import { items } from "./items";
import { SparePartState } from "./types";
import { relations } from "drizzle-orm";

export const sparePartsDetail = pgTable("spare_parts_detail", {
  id: serial("spare_part_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  partNumber: varchar("part_number", { length: 30 }).notNull(),
  serialNumber: varchar("part_serialnumber", { length: 40 }).notNull(),
  consumable: boolean("consumable").default(false).notNull(),
  sparePartState: integer("spare_part_state").notNull().$type<SparePartState>(),
});

export const sparePartRelations = relations(sparePartsDetail, ({ one }) => ({
  item: one(items, {
    fields: [sparePartsDetail.itemId],
    references: [items.id],
  }),
}));
