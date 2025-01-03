import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { items } from "./items";
import { SparePartState } from "./types";
import { relations } from "drizzle-orm";

export const sparepartDetail = table("spare_parts_detail", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  itemID: t
    .integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  sparepartState: t
    .varchar("sparepart_state", { length: 20 })
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
