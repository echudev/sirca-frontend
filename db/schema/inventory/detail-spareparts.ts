import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { items } from "./items";
import { SparePartState } from "./types";
import { relations, sql } from "drizzle-orm";

export const sparepartDetail = pgTable("spare_parts_detail", {
  sparepartID: integer("sparepart_id")
    .primaryKey()
    .default(sql`GENERATED ALLWAYS AS IDENTITY`),
  itemID: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  sparepartState: varchar("sparepart_state", { length: 20 })
    .notNull()
    .$type<SparePartState>(),
});

export const SparepartDetailRelations = relations(
  sparepartDetail,
  ({ one }) => ({
    item: one(items, {
      fields: [sparepartDetail.itemID],
      references: [items.id],
    }),
  })
);
