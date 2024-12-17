import { integer, pgTable, check, primaryKey } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { items } from "./items";
import { stations } from "./stations";
import { commonColumns } from "../common-columns";

export const inventory = pgTable(
  "inventory",
  {
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    stationId: integer("station_id")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    ...commonColumns,
  },
  (table) => [
    {
      pk: primaryKey({ columns: [table.itemId, table.stationId] }),
      checkConstraint: check("quantity_check", sql`${table.quantity} >= 0`),
    },
  ]
);

export const inventoryRelations = relations(inventory, ({ one }) => ({
  item: one(items, {
    fields: [inventory.itemId],
    references: [items.id],
  }),
  station: one(stations, {
    fields: [inventory.stationId],
    references: [stations.id],
  }),
}));
