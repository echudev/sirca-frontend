import {
  integer,
  pgTable,
  varchar,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { items } from "./items";
import { stations } from "./stations";

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
    lastUpdate: timestamp("last_update").defaultNow().notNull(),
    updatedBy: varchar("updated_by", { length: 40 }).notNull(),
  },
  (table) => [check("quantity_check", sql`${table.quantity} >= 0`)]
);
