import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { itemTable } from "./item";
import { station } from "./station";
import { commonColumns } from "../common-columns";

export const transaction = table(
  "transaction",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    itemId: t
      .integer("item_id")
      .notNull()
      .references(() => itemTable.id, { onDelete: "cascade" }),
    fromStationId: t
      .integer("station_id_origen")
      .notNull()
      .references(() => station.id, { onDelete: "cascade" }),
    toStationId: t
      .integer("station_id_destino")
      .notNull()
      .references(() => station.id, { onDelete: "cascade" }),
    quantity: t.integer("cantidad").notNull(),
    updatedAt: commonColumns.updatedAt,
  },
  (table) => [
    t.check(
      "station_check",
      sql`${table.fromStationId} <> ${table.toStationId}`
    ),
    t.check("cantidad_check", sql`${table.quantity} > 0`),
  ]
);
