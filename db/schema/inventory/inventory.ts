import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { itemTable } from "./item";
import { station } from "./station";
import { commonColumns } from "../common-columns";

export const inventory = table(
  "inventory",
  {
    itemId: t
      .integer("item_id")
      .notNull()
      .references(() => itemTable.id, { onDelete: "cascade" }),
    stationId: t
      .integer("station_id")
      .notNull()
      .references(() => station.id, { onDelete: "cascade" }),
    quantity: t.integer("quantity").notNull(),
    ...commonColumns,
  },
  (table) => [
    t.primaryKey({ columns: [table.itemId, table.stationId] }),
    t.check("quantity_check", sql`${table.quantity} >= 0`),
  ]
);
