import { integer, pgTable, serial, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { items } from "./items";
import { stations } from "./stations";
import { commonColumns } from "../common-columns";

export const traslados = pgTable(
  "traslados",
  {
    id: serial("traslado_id").primaryKey(),
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    fromStationId: integer("station_id_origen")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    toStationId: integer("station_id_destino")
      .notNull()
      .references(() => stations.id, { onDelete: "cascade" }),
    quantity: integer("cantidad").notNull(),
    ...commonColumns,
  },
  (table) => [
    check("station_check", sql`${table.fromStationId} <> ${table.toStationId}`),
    check("cantidad_check", sql`${table.quantity} > 0`),
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
