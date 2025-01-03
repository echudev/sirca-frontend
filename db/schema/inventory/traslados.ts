import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { items } from "./items";
import { stations } from "./stations";
import { commonColumns } from "../common-columns";

export const traslados = table(
  "traslados",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    itemId: t
      .integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    fromStationId: t
      .integer("station_id_origen")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    toStationId: t
      .integer("station_id_destino")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
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

export const trasladosRelations = relations(traslados, ({ one }) => ({
  items: one(items, {
    fields: [traslados.itemId],
    references: [items.id],
  }),
  fromStation: one(stations, {
    fields: [traslados.fromStationId],
    references: [stations.id],
  }),
  toStation: one(stations, {
    fields: [traslados.toStationId],
    references: [stations.id],
  }),
}));
